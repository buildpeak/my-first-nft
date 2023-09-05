package receipts

import (
	"log"
	"stevelab/api/types"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Controller interface {
	CreateReceipt(c *gin.Context)
	GetReceiptByNRICAndWalletAddress(c *gin.Context)
}

type controller struct {
	service Service
}

func (c *controller) CreateReceipt(gctx *gin.Context) {
	var req types.APIRequest
	if err := gctx.ShouldBindJSON(&req); err != nil {
		log.Println(err)
		// TODO: return general error
		gctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	receipt, err := c.service.CreateReceipt(gctx.Request.Context(), &req)
	if err != nil {
		log.Println(err)

		gctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	gctx.JSON(http.StatusOK, types.APIResponse{
		Receipt: receipt,
	})
}

func (c *controller) GetReceiptByNRICAndWalletAddress(gctx *gin.Context) {
	var req types.GetReceiptRequest
	if err := gctx.ShouldBindUri(&req); err != nil {
		log.Println(err)
		gctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	receipt, err := c.service.GetReceiptByNRICAndWalletAddress(
		gctx.Request.Context(),
		req.NRIC,
		req.WalletAddress,
	)
	if err != nil {
		log.Println(err)
		gctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	gctx.JSON(http.StatusOK, types.APIResponse{
		Receipt: receipt,
	})
}

func NewController(service Service) Controller {
	return &controller{
		service: service,
	}
}
