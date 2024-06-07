package models

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Id   uint   `json:"id"`
	Name string `json:"name"`
}
