package controllers

import (
	"dds-backends/database"
	"dds-backends/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateProductRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description" binding:"required"`
	Price       float64 `json:"price" binding:"required"`
	Quantity    int     `json:"quantity" binding:"required"`
}

func CreateProduct(c *gin.Context) {
	var req CreateProductRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	product := models.Product{
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
		Quantity:    req.Quantity,
	}

	db := database.GetDbConnection()

	if err := db.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"product": product,
	})

}
