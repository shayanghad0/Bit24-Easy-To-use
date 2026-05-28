# Bit24 Trading Bot 🤖

<div dir="rtl">

### معرفی پروژه

این یک ربات ساده و کاربردی برای انجام معاملات خودکار در صرافی **Bit24** می‌باشد. با استفاده از این کدها می‌توانید به راحتی سفارش‌های خرید و فروش ارزهای دیجیتال را به صورت **مارکت** یا **لیمیت** ثبت کنید.

---

### قابلیت‌ها

| قابلیت | توضیح |
|--------|-------|
| 🟢 خرید مارکت | خرید فوری با مبلغ تومانی مشخص |
| 🔴 فروش مارکت | فروش فوری مقدار مشخصی از ارز |
| 🟡 خرید لیمیت | خرید در قیمت دلخواه شما |
| 🔵 فروش لیمیت | فروش در قیمت دلخواه شما |
| 📦 فروش تمام موجودی | فروش کل یک ارز خاص |

---

### فایل‌های پروژه

| فایل | کاربرد |
|------|--------|
| `2buy.py` | خرید 2 واحد از یک ارز (لیمیت) |
| `2sell.py` | فروش 2 واحد از یک ارز (مارکت) |
| `asell.py` | فروش تمام موجودی یک ارز (مارکت) |
| `irtbuy.py` | خرید ارز با مبلغ تومانی مشخص (مارکت) |
| `API.md` | مستندات کامل API صرافی Bit24 |

---

### پیش‌نیازها

قبل از اجرای کدها، باید کتابخانه زیر را نصب کنید:

```bash
pip install requests
```

---

## نحوه دریافت API Key

1. وارد حساب کاربری خود در [صرافی Bit24](https://bit24.cash) شوید.
2. به بخش [**مدیریت API**](https://bit24.cash/dashboard/api-management) بروید.
3. یک کلید جدید بسازید و دسترسی مورد نیاز را فعال کنید.
4. **API Key** و **Secret Key** را کپی کنید.

---

## نحوه استفاده

### 1. خرید 2 واحد ارز (لیمیت)

```bash
python 2buy.py
```

این کد:
- بهترین قیمت فروش (Ask) را دریافت می‌کند
- سفارش خرید لیمیت را با همان قیمت ثبت می‌کند

### 2. فروش 2 واحد ارز (مارکت)

```bash
python 2sell.py
```

این کد بلافاصله 2 واحد ارز مورد نظر را با قیمت بازار می‌فروشد.

### 3. فروش تمام موجودی یک ارز

```bash
python asell.py
```

این کد:
- موجودی قابل فروش ارز ADA را بررسی می‌کند
- تمام موجودی را به صورت مارکت می‌فروشد

### 4. خرید با مبلغ تومانی مشخص (مارکت)

```bash
python irtbuy.py
```

این کد با مبلغ 200,000 تومان ارز ADA را به صورت مارکت خریداری می‌کند.

---

## تغییر ارز و مقدار

برای تغییر ارز یا مقدار، کافیست فایل مربوطه را باز کنید و مقادیر زیر را تغییر دهید:

```python
params = {
    "base_coin_symbol": "ADA",    # ← اسم ارز را اینجا عوض کنید
    "quote_coin_symbol": "IRT",   # ← ارز پایه (IRT یا USDT)
    "amount": "2",                # ← مقدار را اینجا عوض کنید
}
```

**ارزهای قابل پشتیبانی:** `BTC`, `ETH`, `ADA`, `SOL`, `DOGE`, `XRP` و ...

---

## تفاوت سفارشات

| نوع سفارش | کد `category_type` | توضیح |
|-----------|-------------------|-------|
| **مارکت (Market)** | `"1"` | سفارش فوراً با قیمت بازار اجرا می‌شود |
| **لیمیت (Limit)** | `"0"` | سفارش فقط در قیمت تعیین شده اجرا می‌شود |

| نوع معامله | کد `type` |
|------------|-----------|
| خرید (Buy) | `"1"` |
| فروش (Sell) | `"0"` |

---

## مثال‌های عملی

### فروش 5 عدد ADA به صورت لیمیت در قیمت 100,000 تومان

```python
params = {
    "base_coin_symbol": "ADA",
    "quote_coin_symbol": "IRT",
    "type": "0",           # فروش
    "category_type": "0",  # لیمیت
    "price": "100000",
    "amount": "5"
}
```

### خرید اتریوم با 1 میلیون تومان به صورت مارکت

```python
params = {
    "base_coin_symbol": "ETH",
    "quote_coin_symbol": "IRT",
    "type": "1",           # خرید
    "category_type": "1",  # مارکت
    "quote_coin_amount": "1000000"
}
```

---

## نکات مهم

⚠️ **حتماً به این نکات توجه کنید:**

1. **موجودی حساب خود را بررسی کنید** قبل از ثبت سفارش
2. در خرید **مارکت** از `quote_coin_amount` استفاده کنید
3. در فروش **مارکت** از `amount` استفاده کنید
4. **Secret Key** خود را به هیچکس ندهید
5. برای معاملات واقعی، ابتدا با مبالغ کم تست کنید

---

## ساختار امضای درخواست‌ها

تمامی درخواست‌ها باید با الگوریتم **HMAC-SHA256** امضا شوند:

```python
query = urlencode(sorted(params.items()))
signature = hmac.new(SECRET_KEY.encode(), query.encode(), hashlib.sha256).hexdigest()
params["signature"] = signature
```

---

## لینک‌های مفید

- [وب‌سایت صرافی Bit24](https://bit24.cash)
- [مستندات کامل API](https://docs.bit24.cash/#api-24)
- [موارد مهم مستندات برای خرید/فروش](api.md)

---

## مجوز

این پروژه تحت مجوز **MIT** منتشر شده است.

</div>

---

## English Summary

**Bit24 Trading Bot** is a simple Python tool for automated trading on the Bit24 exchange. It supports market and limit orders for buying and selling cryptocurrencies with IRT.

### Files:
- `2buy.py` - Buy 2 units (limit order)
- `2sell.py` - Sell 2 units (market order)  
- `asell.py` - Sell entire balance (market order)
- `irtbuy.py` - Buy with specific IRR amount (market order)
- `API.md` - Complete API documentation

### Quick Start:
```bash
pip install requests
python 2buy.py  # then enter your API credentials
```

<div dir="rtl">

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