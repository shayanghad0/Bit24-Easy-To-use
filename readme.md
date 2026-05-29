# Bit24 Trading Bot 🤖

<div dir="rtl">

# ربات معامله‌گر Bit24 با Python، Go و Node.js

### معرفی پروژه

این پروژه مجموعه‌ای از ابزارهای ساده و کاربردی برای انجام معاملات خودکار در صرافی **Bit24** می‌باشد.

نسخه‌های پروژه با:

* **Python**
* **Go (Golang)**
* **Node.js**

ارائه شده‌اند تا بتوانید بر اساس نیاز خود از هر زبان استفاده کنید.

با استفاده از این کدها می‌توانید:

* سفارش خرید و فروش ثبت کنید
* سفارش مارکت یا لیمیت ارسال کنید
* تمام موجودی یک ارز را بفروشید
* خرید با مبلغ تومانی انجام دهید
* ساختار API صرافی Bit24 را یاد بگیرید
* SDK یا Trading Bot حرفه‌ای توسعه دهید

---

# قابلیت‌ها

| قابلیت              | توضیح                         |
| ------------------- | ----------------------------- |
| 🟢 خرید مارکت       | خرید فوری با مبلغ تومانی مشخص |
| 🔴 فروش مارکت       | فروش فوری مقدار مشخصی از ارز  |
| 🟡 خرید لیمیت       | خرید در قیمت دلخواه           |
| 🔵 فروش لیمیت       | فروش در قیمت دلخواه           |
| 📦 فروش تمام موجودی | فروش کل موجودی یک ارز         |
| ⚡ نسخه Go           | اجرای سریع‌تر و حرفه‌ای‌تر    |
| 🐍 نسخه Python      | ساده و مناسب یادگیری          |
| 🟩 نسخه Node.js     | مناسب SDK و Bot های مدرن      |

---

# ساختار پروژه

```text
Bit24-Trading-Bot/
│
├── python/
│   ├── 2buy.py
│   ├── 2sell.py
│   ├── asell.py
│   ├── irtbuy.py
│   └── API.md
│
├── go/
│   ├── 2buy.go
│   ├── 2sell.go
│   ├── asell.go
│   ├── irtbuy.go
│   └── API.md
│
├── nodejs/
│   ├── 2buy.js
│   ├── 2sell.js
│   ├── asell.js
│   ├── irtbuy.js
│   └── API.md
│
├── bot/
│   └── rule.md
│   └── Readme.md
│
└── README.md
```

---

# فایل‌های Python

| فایل        | کاربرد                        |
| ----------- | ----------------------------- |
| `2buy.py`   | خرید 2 واحد ارز (Limit Buy)   |
| `2sell.py`  | فروش 2 واحد ارز (Market Sell) |
| `asell.py`  | فروش تمام موجودی ارز          |
| `irtbuy.py` | خرید با مبلغ تومانی           |
| `API.md`    | مستندات کامل Python API       |

---

# فایل‌های Go

| فایل                  | کاربرد                 |
| --------------------- | ---------------------- |
| `2buy.go`             | خرید لیمیت با Go       |
| `2sell.go`            | فروش مارکت با Go       |
| `sell_all_balance.go` | فروش کل موجودی با Go   |
| `irtbuy.go`           | خرید با مبلغ IRT با Go |
| `API_GO.md`           | مستندات کامل API در Go |

---

# فایل‌های Node.js

| فایل            | کاربرد                      |
| --------------- | --------------------------- |
| `2buy.js`       | خرید لیمیت با Node.js       |
| `2sell.js`      | فروش مارکت با Node.js       |
| `asell.js`      | فروش کل موجودی با Node.js   |
| `irtbuy.js`     | خرید با مبلغ تومانی         |
| `API_NODEJS.md` | مستندات کامل API در Node.js |

---

# چرا Node.js؟

نسخه Node.js برای افرادی مناسب است که می‌خواهند:

* SDK حرفه‌ای بسازند
* CLI Tool توسعه دهند
* Trading Bot Real-time بسازند
* WebSocket استفاده کنند
* Express API یا Backend ایجاد کنند
* با TypeScript توسعه دهند
* Bot های مدرن و سریع بسازند

---

# پیش‌نیازهای Node.js

## نصب Node.js

دانلود از سایت رسمی:

```text
https://nodejs.org/
```

بررسی نصب:

```bash
node -v
```

---

# اجرای فایل‌های Node.js

```bash
node 2buy.js
```

---

# نصب پکیج‌ها

در این پروژه از `fetch` داخلی Node.js نسخه 18+ استفاده شده است.

در صورت استفاده از نسخه‌های قدیمی:

```bash
npm install node-fetch
```

---

# ساخت package.json

```bash
npm init -y
```

---

# نصب TypeScript (اختیاری)

```bash
npm install -D typescript ts-node @types/node
```

---

# اجرای TypeScript

```bash
npx ts-node bot.ts
```

---

# ساختار params در Node.js

```js
const params = {
    base_coin_symbol: "ADA",
    quote_coin_symbol: "IRT",
    type: "1",
    category_type: "1",
    quote_coin_amount: "200000"
};
```

---

# نمونه دریافت API Key در Node.js

```js
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Please Enter Your API Key: ", (apiKey) => {

    rl.question("Please Enter Your Secret Key: ", (secretKey) => {

        console.log(apiKey);
        console.log(secretKey);

        rl.close();
    });
});
```

---

# ساخت Signature در Node.js

```js
const crypto = require("crypto");

function createSignature(params, secretKey) {

    const sortedKeys = Object.keys(params).sort();

    const queryString = sortedKeys
        .map((key) => `${key}=${params[key]}`)
        .join("&");

    return crypto
        .createHmac("sha256", secretKey)
        .update(queryString)
        .digest("hex");
}
```

---

# ارسال درخواست در Node.js

```js
const response = await fetch(url, {
    method: "POST",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-BIT24-APIKEY": apiKey
    },
    body: new URLSearchParams(params)
});
```

---

# نحوه استفاده

# 1. خرید 2 واحد ارز (Limit Buy)

## Python

```bash
python 2buy.py
```

## Go

```bash
go run 2buy.go
```

## Node.js

```bash
node 2buy.js
```

---

# 2. فروش 2 واحد ارز (Market Sell)

## Python

```bash
python 2sell.py
```

## Go

```bash
go run 2sell.go
```

## Node.js

```bash
node 2sell.js
```

---

# 3. فروش تمام موجودی

## Python

```bash
python asell.py
```

## Go

```bash
go run sell_all_balance.go
```

## Node.js

```bash
node asell.js
```

---

# 4. خرید با مبلغ تومانی

## Python

```bash
python irtbuy.py
```

## Go

```bash
go run irtbuy.go
```

## Node.js

```bash
node irtbuy.js
```

---

# تغییر ارز و مقدار

## Python

```python
params = {
    "base_coin_symbol": "ADA",
    "quote_coin_symbol": "IRT",
    "amount": "2",
}
```

---

## Go

```go
params := map[string]string{
	"base_coin_symbol":  "ADA",
	"quote_coin_symbol": "IRT",
	"amount":            "2",
}
```

---

## Node.js

```js
const params = {
    base_coin_symbol: "ADA",
    quote_coin_symbol: "IRT",
    amount: "2"
};
```

---

# مثال‌های عملی

# فروش لیمیت ADA

## Python

```python
params = {
    "base_coin_symbol": "ADA",
    "quote_coin_symbol": "IRT",
    "type": "0",
    "category_type": "0",
    "price": "100000",
    "amount": "5"
}
```

---

## Go

```go
params := map[string]string{
	"base_coin_symbol":  "ADA",
	"quote_coin_symbol": "IRT",
	"type":              "0",
	"category_type":     "0",
	"price":             "100000",
	"amount":            "5",
}
```

---

## Node.js

```js
const params = {
    base_coin_symbol: "ADA",
    quote_coin_symbol: "IRT",
    type: "0",
    category_type: "0",
    price: "100000",
    amount: "5"
};
```

---

# خرید اتریوم با 1 میلیون تومان

## Python

```python
params = {
    "base_coin_symbol": "ETH",
    "quote_coin_symbol": "IRT",
    "type": "1",
    "category_type": "1",
    "quote_coin_amount": "1000000"
}
```

---

## Go

```go
params := map[string]string{
	"base_coin_symbol":  "ETH",
	"quote_coin_symbol": "IRT",
	"type":              "1",
	"category_type":     "1",
	"quote_coin_amount": "1000000",
}
```

---

## Node.js

```js
const params = {
    base_coin_symbol: "ETH",
    quote_coin_symbol: "IRT",
    type: "1",
    category_type: "1",
    quote_coin_amount: "1000000"
};
```

---

# مزایای Node.js نسبت به Python

| قابلیت            | Python | Node.js |
| ----------------- | ------ | ------- |
| Real-time         | متوسط  | عالی    |
| WebSocket         | خوب    | عالی    |
| ساخت API          | خوب    | عالی    |
| مناسب Trading Bot | خوب    | عالی    |
| مناسب SDK         | متوسط  | عالی    |
| TypeScript        | محدود  | عالی    |

---

# مزایای Go نسبت به Python

| قابلیت            | Python              | Go         |
| ----------------- | ------------------- | ---------- |
| سرعت اجرا         | متوسط               | بسیار بالا |
| ساخت EXE          | نیازمند ابزار اضافه | داخلی      |
| مصرف RAM          | بیشتر               | کمتر       |
| Concurrency       | محدودتر             | عالی       |
| مناسب Trading Bot | خوب                 | عالی       |

---

# Final Note

⚡ این پروژه می‌تواند پایه‌ای برای ساخت:

* Trading Bot حرفه‌ای
* CLI Tool
* Go SDK
* Node.js SDK
* TypeScript SDK
* Market Scanner
* Auto Trader
* Signal Bot
* Arbitrage System

باشد.

</div>
# English Summary

Bit24 Trading Bot supports:

* Python
* Go (Golang)
* Node.js

implementations for automated trading on Bit24 exchange.

---

# Features

* ✅ Market Buy
* ✅ Market Sell
* ✅ Limit Buy
* ✅ Limit Sell
* ✅ Sell Full Balance
* ✅ HMAC-SHA256 Signing
* ✅ Python Examples
* ✅ Go Examples
* ✅ Node.js Examples

---

# Project Structure

```text id="enstruct"
Bit24-Trading-Bot/

python/
go/
nodejs/
bot/
README.md
```

---

# Quick Start

## Python

Install requirements:

```bash id="enpy1"
pip install requests
```

Run:

```bash id="enpy2"
python 2buy.py
```

---

## Go

Run:

```bash id="engo1"
go run 2buy.go
```

Build executable:

```bash id="engo2"
go build
```

---

## Node.js

Run:

```bash id="ennode1"
node 2buy.js
```

Node.js 18+ recommended.

---

# Supported Examples

| File     | Description          |
| -------- | -------------------- |
| `2buy`   | Limit Buy            |
| `2sell`  | Market Sell          |
| `asell`  | Sell Full Balance    |
| `irtbuy` | Buy Using IRT Amount |

---

# Supported Trading Types

| Type | Value |
| ---- | ----- |
| Buy  | `"1"` |
| Sell | `"0"` |

| Order Type | Value |
| ---------- | ----- |
| Market     | `"1"` |
| Limit      | `"0"` |

---

# Security Notice

* API Keys are processed only on your system
* No data is sent anywhere else
* Never share your Secret Key
* Test with small amounts first

---

# Final Goal

This project can become a base for:

* Trading Bots
* SDK Development
* CLI Tools
* Auto Traders
* Signal Bots
* Arbitrage Systems
* Market Scanners

MIT License
