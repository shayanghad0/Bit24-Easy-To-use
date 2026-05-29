# آموزش کامل سفارش‌گذاری در API صرافی Bit24 با زبان Go

## ساختار کلی سفارش در Bit24

تمام سفارش‌ها در Bit24 با استفاده از یک `map[string]string` ارسال می‌شوند.

نمونه کلی:

```go
params := map[string]string{
	"base_coin_symbol":  "ADA",
	"quote_coin_symbol": "IRT",
	"type":              "0",
	"category_type":     "1",
	"amount":            "2",
}
```

---

# توضیح کامل پارامترها

## `base_coin_symbol`

```go
"base_coin_symbol": "ADA"
```

ارز اصلی‌ای که قصد خرید یا فروش آن را دارید.

مثال‌ها:

| ارز     | مقدار   |
| ------- | ------- |
| بیتکوین | `"BTC"` |
| اتریوم  | `"ETH"` |
| کاردانو | `"ADA"` |
| سولانا  | `"SOL"` |

---

## `quote_coin_symbol`

```go
"quote_coin_symbol": "IRT"
```

ارزی که معامله بر اساس آن انجام می‌شود.

مثال‌ها:

| ارز      | توضیح |
| -------- | ----- |
| `"IRT"`  | تومان |
| `"USDT"` | تتر   |

---

## `type`

```go
"type": "0"
```

مشخص می‌کند سفارش خرید است یا فروش.

| مقدار | نوع سفارش   |
| ----- | ----------- |
| `"0"` | فروش (SELL) |
| `"1"` | خرید (BUY)  |

---

## `category_type`

```go
"category_type": "1"
```

نوع اجرای سفارش را مشخص می‌کند.

| مقدار | نوع اجرا |
| ----- | -------- |
| `"0"` | Limit    |
| `"1"` | Market   |

---

# تفاوت سفارش Market و Limit

## سفارش Market

سفارش بلافاصله با قیمت فعلی بازار اجرا می‌شود.

مثال:

```go
"category_type": "1"
```

یعنی:

> همین الان با بهترین قیمت موجود بازار معامله انجام شود.

---

## سفارش Limit

شما قیمت دلخواه تعیین می‌کنید و سفارش فقط زمانی اجرا می‌شود که بازار به آن قیمت برسد.

مثال:

```go
"category_type": "0"
```

یعنی:

> سفارش فقط روی قیمت تعیین‌شده اجرا شود.

---

# پارامتر `amount`

```go
"amount": "2"
```

مقدار ارزی که قصد خرید یا فروش آن را دارید.

مثال‌ها:

| مقدار   | توضیح   |
| ------- | ------- |
| `"2"`   | دو ADA  |
| `"0.5"` | نیم ADA |
| `"10"`  | ده ADA  |

---

# سفارش فروش Market

## فروش فوری با قیمت بازار

```go
params := map[string]string{
	"base_coin_symbol":  "ADA",
	"quote_coin_symbol": "IRT",

	// SELL
	"type": "0",

	// MARKET
	"category_type": "1",

	// Amount
	"amount": "2",
}
```

این سفارش:

* 2 عدد ADA را
* با قیمت لحظه‌ای بازار
* فوراً می‌فروشد.

---

# سفارش خرید Market

در خرید Market به‌جای `amount` باید مقدار پول پرداختی را مشخص کنید.

مثال:

```go
params := map[string]string{
	"base_coin_symbol":  "ADA",
	"quote_coin_symbol": "IRT",

	// BUY
	"type": "1",

	// MARKET
	"category_type": "1",

	// Amount of IRT to spend
	"quote_coin_amount": "200000",
}
```

یعنی:

> با 200 هزار تومان ADA خریداری کن.

---

# سفارش خرید Limit

```go
params := map[string]string{
	"base_coin_symbol":  "ADA",
	"quote_coin_symbol": "IRT",

	// BUY
	"type": "1",

	// LIMIT
	"category_type": "0",

	// Price
	"price": "95000",

	// Amount
	"amount": "2",
}
```

معنی:

> اگر قیمت ADA به 95 هزار تومان رسید، 2 عدد ADA خریداری شود.

---

# سفارش فروش Limit

```go
params := map[string]string{
	"base_coin_symbol":  "ADA",
	"quote_coin_symbol": "IRT",

	// SELL
	"type": "0",

	// LIMIT
	"category_type": "0",

	// Price
	"price": "120000",

	// Amount
	"amount": "2",
}
```

معنی:

> اگر قیمت ADA به 120 هزار تومان رسید، 2 عدد ADA فروخته شود.

---

# مثال واقعی

فرض کن قیمت فعلی ADA برابر با:

```go
100000
```

تومان باشد.

اگر این مقدار را وارد کنی:

```go
"price": "95000"
```

یعنی:

> وقتی قیمت ADA کاهش پیدا کرد و به 95 هزار تومان رسید، خرید انجام شود.

---

اگر این مقدار را وارد کنی:

```go
"price": "120000"
```

یعنی:

> وقتی قیمت ADA افزایش پیدا کرد و به 120 هزار تومان رسید، فروش انجام شود.

---

# نمونه کامل فروش کل موجودی ADA به‌صورت Limit در Go

```go
package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sort"
	"strings"
)

var API_KEY = "YOUR_API_KEY"
var SECRET_KEY = "YOUR_SECRET_KEY"

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

func main() {
	// =========================
	// GET WALLET BALANCE
	// =========================

	walletURL := "https://rest.bit24.cash/asset/capi/v1/wallet/assets"

	req, _ := http.NewRequest("GET", walletURL, nil)

	q := req.URL.Query()
	q.Add("without_irt", "0")
	q.Add("without_zero", "1")

	req.URL.RawQuery = q.Encode()

	req.Header.Set("Accept", "application/json")
	req.Header.Set("X-BIT24-APIKEY", API_KEY)

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var walletData map[string]interface{}

	json.Unmarshal(body, &walletData)

	// =========================
	// FIND ADA BALANCE
	// =========================

	adaBalance := "0"

	data := walletData["data"].(map[string]interface{})
	assets := data["asset"].([]interface{})

	for _, asset := range assets {
		coin := asset.(map[string]interface{})

		if coin["symbol"] == "ADA" {
			adaBalance = coin["available_balance"].(string)
			break
		}
	}

	fmt.Println("ADA Balance:", adaBalance)

	if adaBalance == "0" {
		fmt.Println("No ADA balance found.")
		return
	}

	// =========================
	// LIMIT SELL SETTINGS
	// =========================

	sellPrice := "120000"

	// =========================
	// LIMIT SELL ORDER
	// =========================

	sellURL := "https://rest.bit24.cash/pro/capi/v1/orders/submit"

	params := map[string]string{
		"base_coin_symbol":  "ADA",
		"quote_coin_symbol": "IRT",

		// SELL
		"type": "0",

		// LIMIT
		"category_type": "0",

		// LIMIT PRICE
		"price": sellPrice,

		// SELL FULL BALANCE
		"amount": adaBalance,
	}

	params["signature"] = signParams(params)

	form := url.Values{}

	for k, v := range params {
		form.Add(k, v)
	}

	request, _ := http.NewRequest(
		"POST",
		sellURL,
		strings.NewReader(form.Encode()),
	)

	request.Header.Set("Accept", "application/json")
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	request.Header.Set("X-BIT24-APIKEY", API_KEY)

	response, err := client.Do(request)
	if err != nil {
		panic(err)
	}

	defer response.Body.Close()

	responseBody, _ := io.ReadAll(response.Body)

	// =========================
	// RESULT
	// =========================

	fmt.Println("Status Code :", response.StatusCode)
	fmt.Println("Response :")
	fmt.Println(string(responseBody))
}
```

---

# جمع‌بندی سریع

| نوع سفارش | مقدار                  |
| --------- | ---------------------- |
| خرید      | `"type": "1"`          |
| فروش      | `"type": "0"`          |
| Market    | `"category_type": "1"` |
| Limit     | `"category_type": "0"` |

---

# تفاوت اصلی BUY و SELL

## BUY Market

```go
"quote_coin_amount"
```

مقدار پولی که میخواهید خرج کنید.

---

## SELL Market

```go
"amount"
```

مقدار کوینی که میخواهید بفروشید.
