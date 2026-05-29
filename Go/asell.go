// asell.go
//
// This code will sell ALL balance of selected coin
// Change coin inside:
// baseCoin := "ADA"
//
// Run:
// go run sell_all_balance.go

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
	"time"
)

const BASE_URL = "https://rest.bit24.cash"

var (
	API_KEY    string
	SECRET_KEY string
)

type WalletResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Assets []Asset `json:"asset"`
	} `json:"data"`
}

type Asset struct {
	Symbol           string `json:"symbol"`
	AvailableBalance string `json:"available_balance"`
}

type SellResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Order struct {
			ID interface{} `json:"id"`
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

func getWalletAssets() ([]Asset, error) {
	endpoint := BASE_URL + "/asset/capi/v1/wallet/assets"

	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	q := req.URL.Query()
	q.Add("without_irt", "0")
	q.Add("without_zero", "1")

	req.URL.RawQuery = q.Encode()

	req.Header.Set("Accept", "application/json")
	req.Header.Set("X-BIT24-APIKEY", API_KEY)

	client := &http.Client{
		Timeout: 15 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf(
			"wallet fetch failed: %s",
			string(body),
		)
	}

	var result WalletResponse

	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, err
	}

	return result.Data.Assets, nil
}

func getAvailableBalance(symbol string) (string, error) {
	assets, err := getWalletAssets()
	if err != nil {
		return "", err
	}

	for _, coin := range assets {
		if coin.Symbol == symbol {
			return coin.AvailableBalance, nil
		}
	}

	return "0", nil
}

func sellAllBalance(baseCoin string, quoteCoin string) error {
	availableBalance, err := getAvailableBalance(baseCoin)
	if err != nil {
		return err
	}

	fmt.Printf(
		"%s available balance: %s\n",
		baseCoin,
		availableBalance,
	)

	if availableBalance == "0" || availableBalance == "0.0" {
		return fmt.Errorf("no %s available to sell", baseCoin)
	}

	endpoint := BASE_URL + "/pro/capi/v1/orders/submit"

	params := map[string]string{
		"base_coin_symbol":  baseCoin,
		"quote_coin_symbol": quoteCoin,
		"type":              "0", // SELL
		"category_type":     "1", // MARKET
		"amount":            availableBalance,
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
		return err
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("X-BIT24-APIKEY", API_KEY)

	client := &http.Client{
		Timeout: 15 * time.Second,
	}

	fmt.Println("Sending sell request...")

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	fmt.Println("Sell response status:", resp.StatusCode)
	fmt.Println(string(body))

	var result SellResponse

	err = json.Unmarshal(body, &result)
	if err != nil {
		return err
	}

	if result.Success {
		fmt.Printf(
			"Order placed successfully! Order ID: %v\n",
			result.Data.Order.ID,
		)
	} else {
		fmt.Printf("Order error: %v\n", result.Error)
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

	// =========================
	// CHANGE COIN HERE
	// =========================
	baseCoin := "ADA"
	quoteCoin := "IRT"

	err := sellAllBalance(baseCoin, quoteCoin)
	if err != nil {
		fmt.Println("Error:", err)
	}
}