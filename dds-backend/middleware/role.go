package middleware

import (
	"dds-backends/database"
	"dds-backends/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RoleAdmin() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id, _ := ctx.Get("id")

		db := database.GetDbConnection()

		var user models.User

		if err := db.Where("id = ?", id).First(&user).Error; err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "user not found",
			})
			return
		}

		if user.RoleID != 1 {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorized",
			})
			return
		}

		ctx.Next()

		sqlDB, _ := db.DB()
		sqlDB.Close()
	}
}
