package main

import (
	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()

	router.GET("/api/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router.POST("/api/verify", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "verified",
		})
	})

	router.Run(":8080")
}
