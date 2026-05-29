# Bit24 Trading Bot 🤖

<div dir="rtl">

# ربات معامله‌گر Bit24 با Python و Go

### معرفی پروژه

این پروژه مجموعه‌ای از ابزارهای ساده و کاربردی برای انجام معاملات خودکار در صرافی **Bit24** می‌باشد.

نسخه‌های پروژه هم با **Python** و هم با **Go (Golang)** ارائه شده‌اند تا بتوانید بر اساس نیاز خود از هر زبان استفاده کنید.

با استفاده از این کدها می‌توانید:

* سفارش خرید و فروش ثبت کنید
* سفارش مارکت یا لیمیت ارسال کنید
* تمام موجودی یک ارز را بفروشید
* خرید با مبلغ تومانی انجام دهید
* ساختار API صرافی Bit24 را یاد بگیرید

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

# چرا Go؟

نسخه Go برای افرادی مناسب است که می‌خواهند:

* سرعت بالاتر داشته باشند
* مصرف RAM کمتر باشد
* فایل EXE مستقل بسازند
* ربات حرفه‌ای‌تر توسعه دهند
* Multi-thread / Goroutine استفاده کنند
* Trading Bot واقعی توسعه دهند

---

# پیش‌نیازهای Python

نصب کتابخانه requests:

```bash
pip install requests
```

اجرای فایل‌ها:

```bash
python 2buy.py
```

---

# پیش‌نیازهای Go

## نصب Go

دانلود از سایت رسمی:

```text
https://go.dev/dl/
```

بررسی نصب:

```bash
go version
```

---

# اجرای فایل‌های Go

## اجرای مستقیم

```bash
go run 2buy.go
```

---

## ساخت فایل EXE

```bash
go build
```

یا:

```bash
go build 2buy.go
```

خروجی:

```text
2buy.exe
```

اجرا:

```bash
./2buy.exe
```

در PowerShell:

```powershell
.\2buy.exe
```

---

# ساخت Go Module

پیشنهاد می‌شود:

```bash
go mod init bit24-bot
```

سپس:

```bash
go mod tidy
```

---

# نحوه دریافت API Key

1. وارد حساب کاربری خود در Bit24 شوید
2. وارد بخش مدیریت API شوید
3. یک API جدید بسازید
4. دسترسی‌های مورد نیاز را فعال کنید
5. API Key و Secret Key را کپی کنید

---

# نمونه دریافت اطلاعات کاربر

## Python

```python
API_KEY = input("Please Enter Your API Key : ")
SECRET_KEY = input("Please Enter Your Secret Key : ")
```

---

## Go

```go
reader := bufio.NewReader(os.Stdin)

fmt.Print("Please Enter Your API Key: ")
apiKey, _ := reader.ReadString('\n')

fmt.Print("Please Enter Your Secret Key: ")
secretKey, _ := reader.ReadString('\n')
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

این فایل:

* بهترین قیمت فروش را دریافت می‌کند
* سفارش Limit Buy ثبت می‌کند

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

این فایل:

* موجودی ارز را دریافت می‌کند
* کل موجودی را می‌فروشد

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

# ارزهای پشتیبانی‌شده

```text
BTC
ETH
ADA
SOL
DOGE
XRP
BNB
TRX
AVAX
DOT
LTC
```

و سایر ارزهای پشتیبانی‌شده در Bit24.

---

# تفاوت سفارشات

| نوع سفارش | category_type |
| --------- | ------------- |
| Market    | `"1"`         |
| Limit     | `"0"`         |

---

| نوع معامله | type  |
| ---------- | ----- |
| Buy        | `"1"` |
| Sell       | `"0"` |

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

# ساخت Signature

تمام درخواست‌ها باید با HMAC-SHA256 امضا شوند.

---

## Python

```python
query = urlencode(sorted(params.items()))

signature = hmac.new(
    SECRET_KEY.encode(),
    query.encode(),
    hashlib.sha256
).hexdigest()

params["signature"] = signature
```

---

## Go

```go
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
```

---

# نکات مهم

⚠️ قبل از استفاده حتماً مطالعه کنید:

1. ابتدا با مبالغ کم تست کنید
2. Secret Key را با کسی به اشتراک نگذارید
3. موجودی حساب را بررسی کنید
4. برای Buy Market از `quote_coin_amount` استفاده کنید
5. برای Sell Market از `amount` استفاده کنید
6. در Go حتماً Timeout تنظیم کنید

---

# Timeout در Go

پیشنهاد حرفه‌ای:

```go
client := &http.Client{
	Timeout: 15 * time.Second,
}
```

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

# مشارکت در پروژه

## چه کار خواهیم کرد؟

| بخش            | توضیح                 |
| -------------- | --------------------- |
| 💡 ایده‌پردازی | توسعه قابلیت‌های جدید |
| 🐛 رفع باگ     | Debug و Fix           |
| 👨‍💻 توسعه    | Pull Request          |
| 📚 مستندسازی   | بهبود Docs            |
| ⚡ نسخه Go      | توسعه SDK حرفه‌ای     |

---

# نحوه مشارکت

1. Fork کنید
2. Rule ها را بخوانید
3. Issue ثبت کنید
4. Pull Request ارسال کنید

---

# English Summary

Bit24 Trading Bot supports both Python and Go implementations for automated trading on Bit24 exchange.

Supported features:

* Market Buy
* Market Sell
* Limit Buy
* Limit Sell
* Sell Full Balance
* HMAC-SHA256 Signing
* Go & Python examples

---

# Quick Start

## Python

```bash
pip install requests
python 2buy.py
```

---

## Go

```bash
go run 2buy.go
```

Build executable:

```bash
go build
```

---

# Security Notice

* API keys are processed only on your system
* No information is sent anywhere else
* Never share your Secret Key
* Use small amounts for testing

---

# License

MIT License

---

# Final Note

⚡ این پروژه می‌تواند پایه‌ای برای ساخت:

* Trading Bot حرفه‌ای
* CLI Tool
* Go SDK
* Market Scanner
* Auto Trader
* Signal Bot
* Arbitrage System

باشد.

</div>


<div dir="rtl">

## 🚀 دعوتنامه ویژه

---

### بیا با هم یک ربات معاملاتی حرفه‌ای برای Bit24 بسازیم!

از صفر تا صد، قدم به قدم، با همفکری و همکاری جمعی.

---

## 📋 چه کار خواهیم کرد؟

| مرحله | توضیح |
|-------|-------|
| 💡 **ایده‌پردازی** | ارائه ایده‌های جدید برای ربات |
| 🐛 **حل مشکلات** | رفع باگ‌ها و خطاهای موجود |
| 👨‍💻 **برنامه‌نویسی** | فورک (Fork) و درخواست Pull Request |
| 🔍 **دیباگ جمعی** | باگ‌یابی و رفع خطا به صورت گروهی |
| 📚 **مستندسازی** | نوشتن مستندات کامل و روان |

---

## 🎯 قوانین مشارکت

برای مشاهده قوانین و نحوهjoin شدن، فایل زیر را مطالعه کنید:

### [📜 قوانین و نحوه مشارکت](bot/rule.md)

---

## 🔧 پیش‌نیازها

- یک حساب گیت‌هاب (GitHub) داشته باشید
- آشنایی مقدماتی با Python
- علاقه به یادگیری و کار تیمی

---

## 🤝 چطور join شوم؟

1. **فورک (Fork)** کنید این ریپازیتوری را
2. **قوانین** را در [`bot/rule.md`](bot/rule.md) بخوانید
3. یک **Issue** جدید باز کنید و ایده یا مشکل خود را مطرح کنید
4. منتظر بمانید تا بقیه اعضا با شما هماهنگ شوند

---

## 💬 ارتباط با تیم

- از بخش **Issues** گیت‌هاب برای بحث استفاده کنید
- هر Pull Request حتماً توضیحات کامل داشته باشد
- سوالات خود را در بخش **Discussions** مطرح کنید

---

## ⭐ بیایید با هم یاد بگیریم!

**هیچ کد آماده‌ای نیست - همه چیز را با هم می‌سازیم!**

</div>

---

## English Version

### 🚀 Special Invitation

**Let's build a professional trading bot for Bit24 together!**

From zero to hero, step by step, with teamwork and collaboration.

---

### 📋 What we'll do:

- 💡 Brainstorming ideas
- 🐛 Solving problems & issues
- 👨‍💻 Programming (Fork & Pull Request)
- 🔍 Debugging together
- 📚 Documentation

---

### 🎯 Rules to join:

### [📜 Read the rules here](bot/rule.md)

---

### 🤝 How to join?

1. **Fork** this repository
2. Read the **rules** in [`bot/rule.md`](bot/rule.md)
3. Open an **Issue** with your idea or problem
4. Wait for team coordination

---

**⭐ No ready code - we build everything together!**



##  ⚠️ نکته مهم

**این کدها صرفاً برای راهنمایی و آموزش نوشته شده‌اند.**

- تمام اطلاعات وارد شده (از جمله **API Key** و **Secret Key**) تنها در سیستم خود شما پردازش می‌شوند
- هیچ اطلاعاتی به هیچ جای دیگری ارسال نمی‌شود
- مسئولیت استفاده از این کدها و هرگونه ضرر احتمالی به عهده خود کاربر می‌باشد
- توصیه می‌شود قبل از استفاده در معاملات واقعی، با مبالغ بسیار کم تست کنید

```python
# اطلاعات شما هرگز جایی ذخیره یا ارسال نمی‌شود
API_KEY = input("Please Enter You API Key : ")      # ✅ فقط در RAM شما
SECRET_KEY = input("Please Enter You Secret Key : ") # ✅ هرگز ذخیره نمی‌شود
```

---

## ⚠️ Important Note

**This code is provided for educational and guidance purposes only.**

- All information entered (including **API Key** and **Secret Key**) is processed **only on your own system**
- **No data is sent anywhere else** - not to me or any third party
- The user is solely responsible for using this code and any potential losses
- It is recommended to test with very small amounts before real trading

```python
# Your information is never stored or sent anywhere
API_KEY = input("Please Enter You API Key : ")      # ✅ Only in your RAM
SECRET_KEY = input("Please Enter You Secret Key : ") # ✅ Never stored
```

---

**🔒 امنیت با شماست | Security is in your hands**

**🧑‍💻 ما فقط برنامه نویسیم | We Only Developer**
</div>


> MIT License ;P
