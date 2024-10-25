package controllers

import (
	"fmt"
	"go_worker/models"
)

func createUser(userId string) map[string]interface{} {
	if _, exists := models.INR_BALANCES[userId]; exists {
		return map[string]interface{}{
			"error":   true,
			"message": "user already exists",
		}
	}
	models.INR_BALANCES[userId] = models.InrBalance{
		Balance: 0,
		Locked:  0,
	}
	return map[string]interface{}{
		"error":  false,
		"msg":    fmt.Sprintf("User %s created", userId),
		"models": models.INR_BALANCES,
	}

}
