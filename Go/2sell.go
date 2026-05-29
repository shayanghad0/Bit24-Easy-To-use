// This code will sell 2 ADA or any amount/coin
//
// Run:
// go run sell.go

package main

import (
	"bufio"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
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

func submitMarketSellOrder() error {
	endpoint := BASE_URL + "/pro/capi/v1/orders/submit"

	params := map[string]string{
		"base_coin_symbol":  "ADA",
		"quote_coin_symbol": "IRT",

		// SELL
		"type": "0",

		// MARKET
		"category_type": "1",

		// Amount of ADA
		"amount": "2",
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

	fmt.Println("Sending sell order request...")

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	fmt.Println("Status Code:", resp.StatusCode)
	fmt.Println("Response:")
	fmt.Println(string(body))

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

	fmt.Println("Program started...")

	err := submitMarketSellOrder()
	if err != nil {
		fmt.Println("Error:", err)
	}
}