type stock struct {
	Quantity int `json:"quantity"`
	Locked   int `json:"locked"`
}

type userStock struct {
	Yes stock `json:"yes"`
	No  stock `json:"no"`
}

var STOCK_BALANCES = map[string]map[string]userStock{}