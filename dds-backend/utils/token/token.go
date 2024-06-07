package token

import (
	"os"

	jwt "github.com/golang-jwt/jwt/v5"
)

func GenerateToken(id uint, email string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    id,
		"email": email,
		// "exp":   os.Getenv("JWT_EXPIRATION"),
	})

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func VerifyToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")),
			nil
	})
}

func GetIdFromToken(tokenString string) (uint, error) {
	token, err := VerifyToken(tokenString)

	if err != nil {
		return 0, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return 0, err
	}

	return uint(claims["id"].(float64)), nil
}

func GetEmailFromToken(tokenString string) (string, error) {
	token, err := VerifyToken(tokenString)

	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return "", err
	}

	return claims["email"].(string), nil
}
