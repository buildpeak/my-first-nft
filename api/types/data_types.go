package types

type GetReceiptRequest struct {
	NRIC          string `uri:"nric"    binding:"required"`
	WalletAddress string `uri:"address" binding:"required"`
}

type APIRequest struct {
	NRIC          string `binding:"required"`
	WalletAddress string `binding:"required"`
}

type APIResponse struct {
	Receipt string
}
