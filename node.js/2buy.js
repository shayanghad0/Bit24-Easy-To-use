/**
 * This Code Will Buy 2 ADA or Any coin you want
 * On lines near the bottom you can change coin and amount
 * For more information read API.md
 */

const crypto = require("crypto");
const readline = require("readline");

const BASE_URL = "https://rest.bit24.cash";

// =========================
// INPUTS
// =========================

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

// =========================
// SIGNATURE
// =========================

function signParams(params, secretKey) {
    /*
      Create HMAC-SHA256 signature
    */

    const paramsToSign = {};

    for (const key in params) {
        if (key !== "signature") {
            paramsToSign[key] = params[key];
        }
    }

    const sortedKeys = Object.keys(paramsToSign).sort();

    const queryString = sortedKeys
        .map((key) => `${key}=${paramsToSign[key]}`)
        .join("&");

    return crypto
        .createHmac("sha256", secretKey)
        .update(queryString)
        .digest("hex");
}

// =========================
// GET BEST ASK
// =========================

async function getBestAsk(apiKey, symbolBase, symbolQuote) {
    const url = new URL(`${BASE_URL}/pro/capi/v1/markets/order-books`);

    url.searchParams.append("base_coin", symbolBase);
    url.searchParams.append("quote_coin", symbolQuote);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-BIT24-APIKEY": apiKey
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error(`Order book error: ${JSON.stringify(data.error)}`);
    }

    const sellOrders = data.data.sell_orders;

    if (!sellOrders || sellOrders.length === 0) {
        throw new Error("No sell orders available.");
    }

    return sellOrders[0].price;
}

// =========================
// SUBMIT LIMIT BUY ORDER
// =========================

async function submitLimitBuyOrder(
    apiKey,
    secretKey,
    symbolBase,
    symbolQuote,
    amount,
    price
) {
    const url = `${BASE_URL}/pro/capi/v1/orders/submit`;

    const params = {
        base_coin_symbol: symbolBase,
        quote_coin_symbol: symbolQuote,
        type: "1",          // buy
        category_type: "0", // limit
        price: price,
        amount: amount
    };

    params.signature = signParams(params, secretKey);

    const body = new URLSearchParams(params);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-BIT24-APIKEY": apiKey
        },
        body: body.toString()
    });

    const text = await response.text();

    if (!response.ok) {
        console.log("Server responded with error:");
        console.log(text);
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return JSON.parse(text);
}

// =========================
// MAIN BUY FUNCTION
// =========================

async function buy2AdaOnIrt(apiKey, secretKey) {

    // =========================
    // CHANGE THESE
    // =========================

    const base = "ADA";
    const quote = "IRT";
    const amount = "2";

    console.log(`Fetching best ask for ${base}/${quote} ...`);

    const bestAsk = await getBestAsk(apiKey, base, quote);

    console.log(`Best ask price (raw): ${bestAsk} ${quote}`);

    console.log(
        `Placing limit buy order for ${amount} ${base} at ${bestAsk} ${quote} ...`
    );

    const response = await submitLimitBuyOrder(
        apiKey,
        secretKey,
        base,
        quote,
        amount,
        bestAsk
    );

    if (response.success) {
        const order = response.data.order;

        console.log("Order placed successfully!");
        console.log(`Order ID: ${order.id}`);
        console.log(`Status: ${order.status_text}`);
        console.log(`Price: ${order.each_price} ${quote}`);
        console.log(`Amount: ${order.amount} ${base}`);
        console.log(`Total: ${order.total} ${quote}`);
    } else {
        console.log(`Order failed: ${JSON.stringify(response.error)}`);
    }
}

// =========================
// START
// =========================

(async () => {
    try {
        const apiKey = await ask("Please Enter Your API Key: ");
        const secretKey = await ask("Please Enter Your Secret Key: ");

        rl.close();

        await buy2AdaOnIrt(apiKey.trim(), secretKey.trim());

    } catch (error) {
        console.log(`An error occurred: ${error.message}`);
    }
})();