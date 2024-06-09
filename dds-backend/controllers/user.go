package controllers

import (
	"dds-backends/database"
	"dds-backends/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUsers(ctx *gin.Context) {
	var users []models.User

	db := database.GetDbConnection()

	if err := db.Find(&users).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal server error",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"users": users,
	})

	sqlDB, _ := db.DB()

	sqlDB.Close()

}
