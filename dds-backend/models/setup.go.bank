package models

import (
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"github.com/joho/godotenv"
)

var DB *gorm.DB

func ConnectDatabase() {
	err := godotenv.Load()

	if err != nil {
		panic("Error loading .env file")
	}

	DbHost := os.Getenv("DB_HOST")
	DbPort := os.Getenv("DB_PORT")
	DbUserName := os.Getenv("DB_USERNAME")
	DbPassword := os.Getenv("DB_PASSWORD")
	DbName := os.Getenv("DB_DATABASE")
	DbDriver := os.Getenv("DB_DRIVER")

	fmt.Println(DbHost, DbPort, DbUserName, DbPassword, DbName, DbDriver)

	DbUrl := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", DbUserName, DbPassword, DbHost, DbPort, DbName)

	DB, err = gorm.Open(DbDriver, DbUrl)

	if err != nil {
		fmt.Println(err.Error())
		panic("Failed to connect to database!")
	}

	fmt.Println("Connection Opened to Database")

	DB.AutoMigrate(&User{})
	DB.AutoMigrate(&TwoFactor{})

}
