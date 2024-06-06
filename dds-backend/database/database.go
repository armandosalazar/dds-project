package database

import (
	"dds-backends/models"
	"fmt"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func GetDbConnection() *gorm.DB {
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_DATABASE")

	dbUrl := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", dbUser, dbPassword, dbHost, dbPort, dbName)

	db, err := gorm.Open(mysql.Open(dbUrl), &gorm.Config{})

	if err != nil {
		fmt.Println(err.Error())
		panic("Failed to connect to database!")
	}

	return db
}

func GenerateTables() {
	db := GetDbConnection()

	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.TwoFactor{})
	db.AutoMigrate(&models.Role{})
	db.AutoMigrate(&models.Product{})

	var count int64
	db.Find(&models.Role{}).Count(&count)

	if count == 0 {
		createRoles(db)
	}

}

func createRoles(db *gorm.DB) {
	role := models.Role{
		Name: "admin",
	}

	db.Create(&role)

	role = models.Role{
		Name: "user",
	}

	db.Create(&role)

	role = models.Role{
		Name: "guest",
	}

	db.Create(&role)
}
