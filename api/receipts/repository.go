package receipts

import (
	"context"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"stevelab/api/types"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type Repository interface {
	CreateReceipt(ctx context.Context, req *types.APIRequest) (string, error)
	GetReceiptByNRICAndWalletAddress(
		ctx context.Context,
		nric string,
		walletAddress string,
	) (string, error)
}

type repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) CreateReceipt(
	ctx context.Context,
	req *types.APIRequest,
) (string, error) {

	reqBodyBytes, err := json.Marshal(req)
	if err != nil {
		return "", err
	}

	if req.NRIC == "" {
		return "", errors.New("NRIC is required")
	}

	if req.WalletAddress == "" {
		return "", errors.New("Wallet address is required")
	}

	var num int
	err = r.db.GetContext(ctx, &num, `
		SELECT COUNT(*) FROM receipts
		WHERE nric = $1 OR wallet_address = $2`,
		req.NRIC, req.WalletAddress)
	if err != nil {
		return "", err
	}
	if num > 0 {
		return "", errors.New("NRIC or wallet address already exists")
	}

	receiptBytes := sha256.Sum256(reqBodyBytes)

	reqBody := string(reqBodyBytes)
	receipt := fmt.Sprintf("%x", receiptBytes)

	log.Println("CreateReceipt", "reqBody", reqBody, "receipt", receipt)

	query := `
	INSERT INTO receipts (id, nric, wallet_address, receipt, request_body)
	VALUES ($1, $2, $3, $4, $5)
	RETURNING nric, wallet_address, receipt
	`

	err = r.db.QueryRowContext(
		ctx, query, uuid.NewString(), req.NRIC,
		req.WalletAddress, receipt, reqBody,
	).Scan(&req.NRIC, &req.WalletAddress, &receipt)

	if err != nil {
		pgErr, ok := err.(*pq.Error)
		if ok && pgErr.Code == "23505" {
			return "", errors.New("Duplicate receipt")
		}
		return "", errors.New("Error creating receipt")
	}

	return receipt, nil
}

func (r *repository) GetReceiptByNRICAndWalletAddress(
	ctx context.Context,
	nric string,
	walletAddress string,
) (string, error) {
	var receipt string
	err := r.db.GetContext(ctx, &receipt, `
		SELECT receipt FROM receipts
		WHERE nric = $1 AND wallet_address = $2`,
		nric, walletAddress)
	if err != nil {
		return "", err
	}
	return receipt, nil
}
