package main

import (
	"fmt"
	"stevelab/api/config"
	"stevelab/api/db"
	"stevelab/api/receipts"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	server := gin.Default()

	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	config := config.New()
	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.DB.Host,
		config.DB.Port,
		config.DB.User,
		config.DB.Pass,
		config.DB.Name,
		config.DB.SSLMode,
	)
	db, err := db.Open(config.DB.DRV, connStr)
	if err != nil {
		panic(err)
	}

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:3000"}
	server.Use(cors.New(corsConfig))

	repository := receipts.NewRepository(db)
	service := receipts.NewService(repository)
	controller := receipts.NewController(service)

	server.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	server.POST("/api/v1/receipts", controller.CreateReceipt)

	server.GET(
		"/api/v1/receipts/:nric/:address",
		controller.GetReceiptByNRICAndWalletAddress,
	)

	server.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
