package models

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID               uint      `gorm:"primaryKey" json:"id"`
	Email            string    `gorm:"size:255;not null;unique" json:"email"`
	Password         string    `gorm:"size:255;not null" json:"password"`
	RoleID           uint      `json:"role_id"`
	Role             Role      `json:"role"`
	TwoFactorEnabled bool      `json:"twoFactorEnabled"`
	TwoFactorID      uint      `json:"twoFactorId"`
	TwoFactor        TwoFactor `json:"twoFactor"`
	Posts            []Post    `json:"posts"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}
