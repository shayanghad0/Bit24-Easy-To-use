/**
 * This code will sell 2 or any amount of ADA or any coin
 * Example: sell 2 ADA
 *
 * You can change values near the bottom
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
    const sortedKeys = Object.keys(params).sort();

    const queryString = sortedKeys
        .map((key) => `${key}=${params[key]}`)
        .join("&");

    return crypto
        .createHmac("sha256", secretKey)
        .update(queryString)
        .digest("hex");
}

// =========================
// SUBMIT MARKET SELL ORDER
// =========================

async function submitMarketSellOrder(
    apiKey,
    secretKey,
    baseCoin,
    quoteCoin,
    amount
) {
    const url = `${BASE_URL}/pro/capi/v1/orders/submit`;

    const params = {
        base_coin_symbol: baseCoin,
        quote_coin_symbol: quoteCoin,

        // SELL
        type: "0",

        // MARKET
        category_type: "1",

        // Amount
        amount: amount
    };

    // Generate signature
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

    console.log(`Status Code: ${response.status}`);
    console.log(text);

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return JSON.parse(text);
}

// =========================
// MAIN
// =========================

async function main() {
    try {

        const apiKey = await ask("Please Enter Your API Key: ");
        const secretKey = await ask("Please Enter Your Secret Key: ");

        rl.close();

        // =========================
        // CHANGE THESE
        // =========================

        const baseCoin = "ADA";
        const quoteCoin = "IRT";
        const amount = "2";

        console.log(
            `Selling ${amount} ${baseCoin} on ${quoteCoin} market...`
        );

        const result = await submitMarketSellOrder(
            apiKey.trim(),
            secretKey.trim(),
            baseCoin,
            quoteCoin,
            amount
        );

        if (result.success) {
            console.log("Sell order placed successfully!");

            if (result.data?.order) {
                const order = result.data.order;

                console.log(`Order ID: ${order.id}`);
                console.log(`Status: ${order.status_text}`);
                console.log(`Amount: ${order.amount}`);
                console.log(`Total: ${order.total}`);
            }
        } else {
            console.log("Sell order failed:");
            console.log(result.error);
        }

    } catch (error) {
        console.log(`An error occurred: ${error.message}`);
    }
}

main();