package models

import "gorm.io/gorm"

type Post struct {
	gorm.Model
	Id      uint   `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	UserId  uint   `json:"user_id"`
}
