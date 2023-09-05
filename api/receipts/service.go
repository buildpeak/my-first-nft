package receipts

import (
	"context"
	"stevelab/api/types"
)

type Service interface {
	CreateReceipt(ctx context.Context, req *types.APIRequest) (string, error)
	GetReceiptByNRICAndWalletAddress(
		ctx context.Context,
		nric string,
		walletAddress string,
	) (string, error)
}

type service struct {
	repository Repository
}

func NewService(repository Repository) Service {
	return &service{
		repository: repository,
	}
}

func (s *service) CreateReceipt(
	ctx context.Context,
	req *types.APIRequest,
) (string, error) {
	receipt, err := s.repository.CreateReceipt(ctx, req)
	if err != nil {
		return "", err
	}

	return receipt, nil
}

func (s *service) GetReceiptByNRICAndWalletAddress(
	ctx context.Context,
	nric string,
	walletAddress string,
) (string, error) {
	receipt, err := s.repository.GetReceiptByNRICAndWalletAddress(
		ctx,
		nric,
		walletAddress,
	)
	if err != nil {
		return "", err
	}

	return receipt, nil
}
