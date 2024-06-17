package main

import (
	"dds-backends/config"
	"dds-backends/controllers"
	"dds-backends/database"
	"dds-backends/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	database.GenerateTables()

	r := gin.Default()
	r.Use(config.Cors())

	api := r.Group("/api")

	api.POST("/register", controllers.Register)
	api.POST("/login", controllers.Login)
	api.POST("/verify-2fa", controllers.Verify2FA)
	api.GET("/enable-2fa", middleware.AuthMiddleware(), controllers.Enable2FA)
	api.POST("/posts", middleware.AuthMiddleware(), controllers.CreatePost)
	api.GET("/posts", middleware.AuthMiddleware(), controllers.GetPosts)
	api.GET("/users", controllers.GetUsers)

	r.Run(":8080")
}
