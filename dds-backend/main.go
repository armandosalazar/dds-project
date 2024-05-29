package main

import (
	"dds-backends/config"
	"dds-backends/controllers"
	"dds-backends/database"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	database.GenerateTables()

	router := gin.Default()
	router.Use(config.Cors())

	api := router.Group("/api")

	api.POST("/register", controllers.Register)
	api.POST("/login", controllers.Login)
	api.POST("/verify-2fa", controllers.Verify2FA)

	router.Run(":8080")
}
