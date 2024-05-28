package models

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email            string    `gorm:"size:255;not null;unique" json:"email"`
	Password         string    `gorm:"size:255;not null" json:"password"`
	TwoFactorEnabled bool      `json:"two_factor_enabled"`
	TwoFactor        TwoFactor `gorm:"foreignKey:UserID"`
}

// func (u *User) SaveUser() (*User, error) {
//	err := DB.Create(&u).Error
//	if err != nil {
//		return nil, err
//	}
//	return u, nil
// }

func (u *User) BeforeSave() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// func VerifyPassword(password, hashedPassword string) error {
// 	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
// }

// func LoginCheck(email string, password string) (string, error) {
// 	db := database.GetDbConnection()
// 	var err error

// 	user := User{}

// 	err = db.Model(User{}).Where("email = ?", email).Take(&user).Error

// 	if err != nil {
// 		return "", err
// 	}

// 	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

// 	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
// 		return "", err
// 	}

// 	token, err := token.GenerateToken(user.ID)

// 	if err != nil {
// 		return "", err
// 	}

// 	return token, nil
// }
