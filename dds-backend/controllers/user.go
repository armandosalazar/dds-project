package controllers

import (
	"dds-backends/database"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserAPI struct {
	ID    uint   `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

func GetUsers(ctx *gin.Context) {
	var users []UserAPI

	db := database.GetDbConnection()

	if err := db.Table("users").Select("users.id", "users.email", "roles.name as role").Joins("left join roles on roles.id = users.role_id").Scan(&users).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	fmt.Printf("%+v\n", users)

	ctx.JSON(http.StatusOK, gin.H{
		"users": users,
	})

	sqlDB, _ := db.DB()

	sqlDB.Close()
}

type UpdateUserRequest struct {
	RoleID uint `json:"roleId"`
}

func UpdateUser(ctx *gin.Context) {
	var req UpdateUserRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	id := ctx.Param("id")

	db := database.GetDbConnection()

	if err := db.Exec("UPDATE users SET role_id = ? WHERE id = ?", req.RoleID, id).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "user updated",
	})

	sqlDB, _ := db.DB()
	sqlDB.Close()
}

func DeleteUser(ctx *gin.Context) {
	id := ctx.Param("id")

	db := database.GetDbConnection()

	if err := db.Exec("DELETE FROM users WHERE id = ?", id).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "User deleted",
	})

	sqlDB, _ := db.DB()
	sqlDB.Close()
}
