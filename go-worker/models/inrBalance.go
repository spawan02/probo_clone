package models

type InrBalance struct {
	Balance int `json:"balance"`
	Locked  int `json:"locked"`
}

var INR_BALANCES = map[string]InrBalance{}
