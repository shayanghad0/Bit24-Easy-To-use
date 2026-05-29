# آموزش کامل سفارش‌گذاری در API صرافی Bit24 با Node.js

## ساختار کلی سفارش در Bit24

تمام سفارش‌ها در Bit24 با استفاده از یک `params` ارسال می‌شوند.

نمونه کلی:

```js
const params = {
    base_coin_symbol: "ADA",
    quote_coin_symbol: "IRT",
    type: "0",
    category_type: "1",
    amount: "2"
};
```

---

# توضیح کامل پارامترها

## `base_coin_symbol`

```js
base_coin_symbol: "ADA"
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

```js
quote_coin_symbol: "IRT"
```

ارزی که معامله بر اساس آن انجام می‌شود.

مثال‌ها:

| ارز      | توضیح |
| -------- | ----- |
| `"IRT"`  | تومان |
| `"USDT"` | تتر   |

---

## `type`

```js
type: "0"
```

مشخص می‌کند سفارش خرید است یا فروش.

| مقدار | نوع سفارش   |
| ----- | ----------- |
| `"0"` | فروش (SELL) |
| `"1"` | خرید (BUY)  |

---

## `category_type`

```js
category_type: "1"
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

```js
category_type: "1"
```

یعنی:

> همین الان با بهترین قیمت موجود بازار معامله انجام شود.

---

## سفارش Limit

شما قیمت دلخواه تعیین می‌کنید و سفارش فقط زمانی اجرا می‌شود که بازار به آن قیمت برسد.

مثال:

```js
category_type: "0"
```

یعنی:

> سفارش فقط روی قیمت تعیین‌شده اجرا شود.

---

# پارامتر `amount`

```js
amount: "2"
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

```js
const params = {
    base_coin_symbol: "ADA",
    quote_coin_symbol: "IRT",

    // SELL
    type: "0",

    // MARKET
    category_type: "1",

    // Amount
    amount: "2"
};
```

این سفارش:

* 2 عدد ADA را
* با قیمت لحظه‌ای بازار
* فوراً می‌فروشد.

---

# سفارش خرید Market

در خرید Market به‌جای `amount` باید مقدار پول پرداختی را مشخص کنید.

مثال:

```js
const params = {
    base_coin_symbol: "ADA",
    quote_coin_symbol: "IRT",

    // BUY
    type: "1",

    // MARKET
    category_type: "1",

    // Amount of IRT to spend
    quote_coin_amount: "200000"
};
```

یعنی:

> با 200 هزار تومان ADA خریداری کن.

---

# سفارش خرید Limit

```js
const params = {
    base_coin_symbol: "ADA",
    quote_coin_symbol: "IRT",

    // BUY
    type: "1",

    // LIMIT
    category_type: "0",

    // Price
    price: "95000",

    // Amount
    amount: "2"
};
```

معنی:

> اگر قیمت ADA به 95 هزار تومان رسید، 2 عدد ADA خریداری شود.

---

# سفارش فروش Limit

```js
const params = {
    base_coin_symbol: "ADA",
    quote_coin_symbol: "IRT",

    // SELL
    type: "0",

    // LIMIT
    category_type: "0",

    // Price
    price: "120000",

    // Amount
    amount: "2"
};
```

معنی:

> اگر قیمت ADA به 120 هزار تومان رسید، 2 عدد ADA فروخته شود.

---

# مثال واقعی

فرض کن قیمت فعلی ADA برابر با:

```js
100000
```

تومان باشد.

اگر این مقدار را وارد کنی:

```js
price: "95000"
```

یعنی:

> وقتی قیمت ADA کاهش پیدا کرد و به 95 هزار تومان رسید، خرید انجام شود.

---

اگر این مقدار را وارد کنی:

```js
price: "120000"
```

یعنی:

> وقتی قیمت ADA افزایش پیدا کرد و به 120 هزار تومان رسید، فروش انجام شود.

---

# نمونه کامل فروش کل موجودی ADA به‌صورت Limit

```js
const crypto = require("crypto");
const readline = require("readline");

const BASE_URL = "https://rest.bit24.cash";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

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

async function main() {

    const apiKey = await ask("Please Enter Your API Key : ");
    const secretKey = await ask("Please Enter Your Secret Key : ");

    // =========================
    // GET WALLET BALANCE
    // =========================

    const walletUrl = new URL(
        `${BASE_URL}/asset/capi/v1/wallet/assets`
    );

    walletUrl.searchParams.append("without_irt", "0");
    walletUrl.searchParams.append("without_zero", "1");

    const walletResponse = await fetch(walletUrl, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-BIT24-APIKEY": apiKey
        }
    });

    const walletData = await walletResponse.json();

    const assets = walletData?.data?.asset || [];

    // =========================
    // FIND ADA BALANCE
    // =========================

    let adaBalance = 0;

    for (const coin of assets) {

        if (coin.symbol === "ADA") {
            adaBalance = parseFloat(
                coin.available_balance
            );
            break;
        }
    }

    console.log("ADA Balance:", adaBalance);

    if (adaBalance <= 0) {
        console.log("No ADA balance found.");
        process.exit(0);
    }

    // =========================
    // LIMIT SELL SETTINGS
    // =========================

    const sellPrice = await ask(
        "Enter Sell Price (IRT) : "
    );

    // =========================
    // LIMIT SELL ORDER
    // =========================

    const sellUrl =
        `${BASE_URL}/pro/capi/v1/orders/submit`;

    const params = {
        base_coin_symbol: "ADA",
        quote_coin_symbol: "IRT",

        // SELL
        type: "0",

        // LIMIT
        category_type: "0",

        // LIMIT PRICE
        price: sellPrice,

        // SELL FULL BALANCE
        amount: String(adaBalance)
    };

    // =========================
    // SIGNATURE
    // =========================

    params.signature = createSignature(
        params,
        secretKey
    );

    // =========================
    // SEND ORDER
    // =========================

    const body = new URLSearchParams(params);

    const sellResponse = await fetch(sellUrl, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type":
                "application/x-www-form-urlencoded",
            "X-BIT24-APIKEY": apiKey
        },
        body: body.toString()
    });

    // =========================
    // RESULT
    // =========================

    console.log(
        "Status Code :",
        sellResponse.status
    );

    const result = await sellResponse.text();

    console.log("Response :");
    console.log(result);

    rl.close();
}

main();
```

---

# جمع‌بندی سریع

| نوع سفارش | مقدار                |
| --------- | -------------------- |
| خرید      | `type: "1"`          |
| فروش      | `type: "0"`          |
| Market    | `category_type: "1"` |
| Limit     | `category_type: "0"` |

---

# تفاوت اصلی BUY و SELL

## BUY Market

```js
quote_coin_amount
```

مقدار پولی که میخواهید خرج کنید.

---

## SELL Market

```js
amount
```

مقدار کوینی که میخواهید بفروشید.
