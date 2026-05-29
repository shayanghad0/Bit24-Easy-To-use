# آموزش کامل سفارش‌گذاری در API صرافی Bit24

## ساختار کلی سفارش در Bit24

تمام سفارش‌ها در Bit24 با استفاده از یک `params` ارسال می‌شوند.

نمونه کلی:

```python
params = {
    "base_coin_symbol": "ADA",
    "quote_coin_symbol": "IRT",
    "type": "0",
    "category_type": "1",
    "amount": "2"
}
```

---

# توضیح کامل پارامترها

## `base_coin_symbol`

```python
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

```python
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

```python
"type": "0"
```

مشخص می‌کند سفارش خرید است یا فروش.

| مقدار | نوع سفارش   |
| ----- | ----------- |
| `"0"` | فروش (SELL) |
| `"1"` | خرید (BUY)  |

---

## `category_type`

```python
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

```python
"category_type": "1"
```

یعنی:

> همین الان با بهترین قیمت موجود بازار معامله انجام شود.

---

## سفارش Limit

شما قیمت دلخواه تعیین می‌کنید و سفارش فقط زمانی اجرا می‌شود که بازار به آن قیمت برسد.

مثال:

```python
"category_type": "0"
```

یعنی:

> سفارش فقط روی قیمت تعیین‌شده اجرا شود.

---

# پارامتر `amount`

```python
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

```python
params = {
    "base_coin_symbol": "ADA",
    "quote_coin_symbol": "IRT",

    # SELL
    "type": "0",

    # MARKET
    "category_type": "1",

    # Amount
    "amount": "2"
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

```python
params = {
    "base_coin_symbol": "ADA",
    "quote_coin_symbol": "IRT",

    # BUY
    "type": "1",

    # MARKET
    "category_type": "1",

    # Amount of IRT to spend
    "quote_coin_amount": "200000"
}
```

یعنی:

> با 200 هزار تومان ADA خریداری کن.

---

# سفارش خرید Limit

```python
params = {
    "base_coin_symbol": "ADA",
    "quote_coin_symbol": "IRT",

    # BUY
    "type": "1",

    # LIMIT
    "category_type": "0",

    # Price
    "price": "95000",

    # Amount
    "amount": "2"
}
```

معنی:

> اگر قیمت ADA به 95 هزار تومان رسید، 2 عدد ADA خریداری شود.

---

# سفارش فروش Limit

```python
params = {
    "base_coin_symbol": "ADA",
    "quote_coin_symbol": "IRT",

    # SELL
    "type": "0",

    # LIMIT
    "category_type": "0",

    # Price
    "price": "120000",

    # Amount
    "amount": "2"
}
```

معنی:

> اگر قیمت ADA به 120 هزار تومان رسید، 2 عدد ADA فروخته شود.

---

# مثال واقعی

فرض کن قیمت فعلی ADA برابر با:

```python
100000
```

تومان باشد.

اگر این مقدار را وارد کنی:

```python
"price": "95000"
```

یعنی:

> وقتی قیمت ADA کاهش پیدا کرد و به 95 هزار تومان رسید، خرید انجام شود.

---

اگر این مقدار را وارد کنی:

```python
"price": "120000"
```

یعنی:

> وقتی قیمت ADA افزایش پیدا کرد و به 120 هزار تومان رسید، فروش انجام شود.

---

# نمونه کامل فروش کل موجودی ADA به‌صورت Limit

```python
import requests
import hashlib
import hmac
from urllib.parse import urlencode

API_KEY = input("Please Enter Your API Key : ")
SECRET_KEY = input("Please Enter Your Secret Key : ")

# =========================
# GET WALLET BALANCE
# =========================

wallet_url = "https://rest.bit24.cash/pro/capi/v1/wallets"

wallet_headers = {
    "Accept": "application/json",
    "X-BIT24-APIKEY": API_KEY
}

wallet_response = requests.get(
    wallet_url,
    headers=wallet_headers
)

wallet_data = wallet_response.json()

# =========================
# FIND ADA BALANCE
# =========================

ada_balance = 0

for wallet in wallet_data["data"]:
    if wallet["coin_symbol"] == "ADA":
        ada_balance = float(wallet["balance"])
        break

print("ADA Balance:", ada_balance)

if ada_balance <= 0:
    print("No ADA balance found.")
    exit()

# =========================
# LIMIT SELL SETTINGS
# =========================

sell_price = input("Enter Sell Price (IRT) : ")

# =========================
# LIMIT SELL ORDER
# =========================

sell_url = "https://rest.bit24.cash/pro/capi/v1/orders/submit"

params = {
    "base_coin_symbol": "ADA",
    "quote_coin_symbol": "IRT",

    # SELL
    "type": "0",

    # LIMIT
    "category_type": "0",

    # LIMIT PRICE
    "price": sell_price,

    # SELL FULL BALANCE
    "amount": str(ada_balance)
}

# =========================
# SIGNATURE
# =========================

query = urlencode(sorted(params.items()))

signature = hmac.new(
    SECRET_KEY.encode(),
    query.encode(),
    hashlib.sha256
).hexdigest()

params["signature"] = signature

# =========================
# HEADERS
# =========================

sell_headers = {
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    "X-BIT24-APIKEY": API_KEY
}

# =========================
# SEND ORDER
# =========================

sell_response = requests.post(
    sell_url,
    headers=sell_headers,
    data=params
)

# =========================
# RESULT
# =========================

print("Status Code :", sell_response.status_code)
print("Response :")
print(sell_response.text)
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

```python
"quote_coin_amount"
```

مقدار پولی که میخواهید خرج کنید.

---

## SELL Market

```python
"amount"
```

مقدار کوینی که میخواهید بفروشید.
