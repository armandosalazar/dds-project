package models

import "gorm.io/gorm"

type TwoFactor struct {
	gorm.Model
	Url    string `json:"url"`
	Secret string
}
