/**
 * This code will help you buy ADA or any coin
 * using a specific amount of IRT on market price
 *
 * Example:
 * Spend 200000 IRT to buy ADA
 *
 * You can edit values near the bottom
 * For more information read API.md
 */

const crypto = require("crypto");
const readline = require("readline");

const BASE_URL = "https://rest.bit24.cash";

// =========================
// INPUT
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

// =========================
// MARKET BUY
// =========================

async function marketBuy(
    apiKey,
    secretKey,
    baseCoin,
    quoteCoin,
    quoteCoinAmount
) {

    const url = `${BASE_URL}/pro/capi/v1/orders/submit`;

    const params = {
        base_coin_symbol: baseCoin,
        quote_coin_symbol: quoteCoin,

        // BUY
        type: "1",

        // MARKET
        category_type: "1",

        // Amount of quote coin to spend
        quote_coin_amount: quoteCoinAmount
    };

    // Create signature
    params.signature = createSignature(params, secretKey);

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

    console.log("Response Status:", response.status);
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

        const apiKey = await ask("Please Enter Your API Key : ");
        const secretKey = await ask("Please Enter Your Secret Key : ");

        rl.close();

        // =========================
        // CHANGE THESE
        // =========================

        const baseCoin = "ADA";
        const quoteCoin = "IRT";

        // Amount of IRT to spend
        const spendAmount = "200000";

        console.log(
            `Buying ${baseCoin} using ${spendAmount} ${quoteCoin} at market price...`
        );

        const result = await marketBuy(
            apiKey.trim(),
            secretKey.trim(),
            baseCoin,
            quoteCoin,
            spendAmount
        );

        // =========================
        // RESULT
        // =========================

        if (result.success) {

            console.log("Market buy order placed successfully!");

            if (result.data?.order) {

                const order = result.data.order;

                console.log(`Order ID: ${order.id}`);
                console.log(`Status: ${order.status_text}`);
                console.log(`Amount: ${order.amount}`);
                console.log(`Total: ${order.total}`);
                console.log(`Price: ${order.each_price}`);
            }

        } else {

            console.log("Order failed:");
            console.log(result.error);
        }

    } catch (error) {

        console.log(`An error occurred: ${error.message}`);
    }
}

main();