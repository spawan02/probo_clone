type userOrders struct {
	Type     string `json:"type"`
	Quantity int    `json:"quantity"`
}

type PriceLevel struct {
	Total  int                   `json:"total"`
	Orders map[string]userOrders `json:"orders"`
}
type OrderBookSymbol struct {
	Yes map[float64]PriceLevel `json:"yes"`
	No  map[float64]PriceLevel `json:"no"`
}

var ORDERBOOK = map[string]OrderBookSymbol{}