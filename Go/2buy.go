// This Code Will Buy 2 ADA or Any coin you want
// Change base, quote and amount inside buy2ADAOnIRT()
//
// Run:
// go run main.go

package main

import (
	"bufio"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strings"
)

const BASE_URL = "https://rest.bit24.cash"

var (
	API_KEY    string
	SECRET_KEY string
)

type OrderBookResponse struct {
	Success bool `json:"success"`
	Data    struct {
		SellOrders []struct {
			Price string `json:"price"`
		} `json:"sell_orders"`
	} `json:"data"`
	Error interface{} `json:"error"`
}

type SubmitOrderResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Order struct {
			ID         interface{} `json:"id"`
			StatusText string      `json:"status_text"`
			EachPrice  string      `json:"each_price"`
			Amount     string      `json:"amount"`
			Total      string      `json:"total"`
		} `json:"order"`
	} `json:"data"`
	Error interface{} `json:"error"`
}

func signParams(params map[string]string) string {
	var keys []string

	for k := range params {
		if k != "signature" {
			keys = append(keys, k)
		}
	}

	sort.Strings(keys)

	var parts []string
	for _, k := range keys {
		parts = append(parts, fmt.Sprintf("%s=%s", k, params[k]))
	}

	queryString := strings.Join(parts, "&")

	h := hmac.New(sha256.New, []byte(SECRET_KEY))
	h.Write([]byte(queryString))

	return hex.EncodeToString(h.Sum(nil))
}

func getBestAsk(symbolBase string, symbolQuote string) (string, error) {
	endpoint := BASE_URL + "/pro/capi/v1/markets/order-books"

	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return "", err
	}

	q := req.URL.Query()
	q.Add("base_coin", symbolBase)
	q.Add("quote_coin", symbolQuote)
	req.URL.RawQuery = q.Encode()

	req.Header.Set("Accept", "application/json")
	req.Header.Set("X-BIT24-APIKEY", API_KEY)

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("http error: %s", string(body))
	}

	var result OrderBookResponse

	err = json.Unmarshal(body, &result)
	if err != nil {
		return "", err
	}

	if !result.Success {
		return "", fmt.Errorf("order book error: %v", result.Error)
	}

	if len(result.Data.SellOrders) == 0 {
		return "", fmt.Errorf("no sell orders available")
	}

	return result.Data.SellOrders[0].Price, nil
}

func submitLimitBuyOrder(
	symbolBase string,
	symbolQuote string,
	amount string,
	price string,
) (*SubmitOrderResponse, error) {

	endpoint := BASE_URL + "/pro/capi/v1/orders/submit"

	params := map[string]string{
		"base_coin_symbol":  symbolBase,
		"quote_coin_symbol": symbolQuote,
		"type":              "1", // buy
		"category_type":     "0", // limit
		"price":             price,
		"amount":            amount,
	}

	params["signature"] = signParams(params)

	form := url.Values{}
	for k, v := range params {
		form.Add(k, v)
	}

	req, err := http.NewRequest(
		"POST",
		endpoint,
		strings.NewReader(form.Encode()),
	)

	if err != nil {
		return nil, err
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("X-BIT24-APIKEY", API_KEY)

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		fmt.Println("Server responded with error:")
		fmt.Println(string(body))
		return nil, fmt.Errorf("http error: %s", resp.Status)
	}

	var result SubmitOrderResponse

	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func buy2ADAOnIRT() error {
	base := "ADA"
	quote := "IRT"
	amount := "2"

	fmt.Println("Fetching best ask for ADA/IRT ...")

	bestAsk, err := getBestAsk(base, quote)
	if err != nil {
		return err
	}

	fmt.Printf("Best ask price (raw): %s IRT\n", bestAsk)

	fmt.Printf(
		"Placing limit buy order for %s ADA at %s IRT ...\n",
		amount,
		bestAsk,
	)

	response, err := submitLimitBuyOrder(
		base,
		quote,
		amount,
		bestAsk,
	)

	if err != nil {
		return err
	}

	if response.Success {
		order := response.Data.Order

		fmt.Println("Order placed successfully!")
		fmt.Printf("Order ID: %v\n", order.ID)
		fmt.Printf("Status: %s\n", order.StatusText)
		fmt.Printf("Price: %s IRT\n", order.EachPrice)
		fmt.Printf("Amount: %s ADA\n", order.Amount)
		fmt.Printf("Total: %s IRT\n", order.Total)

	} else {
		fmt.Printf("Order failed: %v\n", response.Error)
	}

	return nil
}

func main() {
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Please Enter Your API Key: ")
	apiKey, _ := reader.ReadString('\n')

	fmt.Print("Please Enter Your Secret Key: ")
	secretKey, _ := reader.ReadString('\n')

	API_KEY = strings.TrimSpace(apiKey)
	SECRET_KEY = strings.TrimSpace(secretKey)

	err := buy2ADAOnIRT()
	if err != nil {
		fmt.Printf("An error occurred: %v\n", err)
	}
}