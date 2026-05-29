/**
 * This code will help you sell all balance of a selected coin
 * You can change the coin near the bottom
 *
 * For more information please read API.md
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
// GET WALLET BALANCES
// =========================

async function getWalletAssets(apiKey) {

    const url = new URL(
        `${BASE_URL}/asset/capi/v1/wallet/assets`
    );

    url.searchParams.append("without_irt", "0");
    url.searchParams.append("without_zero", "1");

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-BIT24-APIKEY": apiKey
        }
    });

    const text = await response.text();

    if (!response.ok) {
        console.log("Wallet fetch failed:");
        console.log(text);

        throw new Error(`HTTP Error: ${response.status}`);
    }

    return JSON.parse(text);
}

// =========================
// FIND COIN BALANCE
// =========================

function findCoinBalance(assets, coinSymbol) {

    for (const coin of assets) {

        if (coin.symbol === coinSymbol) {
            return parseFloat(coin.available_balance);
        }
    }

    return 0;
}

// =========================
// SELL ALL BALANCE
// =========================

async function sellAllBalance(
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

        // Full balance
        amount: String(amount)
    };

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

    console.log("Sell response status:", response.status);
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

        // =========================
        // FETCH WALLET
        // =========================

        console.log("Fetching wallet balances...");

        const walletData = await getWalletAssets(apiKey.trim());

        const assets = walletData?.data?.asset || [];

        // =========================
        // FIND AVAILABLE BALANCE
        // =========================

        const availableBalance = findCoinBalance(
            assets,
            baseCoin
        );

        console.log(
            `${baseCoin} available balance: ${availableBalance}`
        );

        if (availableBalance <= 0) {
            console.log(`No ${baseCoin} available to sell.`);
            return;
        }

        // =========================
        // SELL ALL
        // =========================

        console.log(
            `Selling all ${baseCoin} balance on ${quoteCoin} market...`
        );

        const result = await sellAllBalance(
            apiKey.trim(),
            secretKey.trim(),
            baseCoin,
            quoteCoin,
            availableBalance
        );

        if (result.success) {

            console.log("Order placed successfully!");

            if (result.data?.order) {

                const order = result.data.order;

                console.log(`Order ID: ${order.id}`);
                console.log(`Status: ${order.status_text}`);
                console.log(`Amount: ${order.amount}`);
                console.log(`Total: ${order.total}`);
            }

        } else {

            console.log("Order error:");
            console.log(result.error);
        }

    } catch (error) {

        console.log(`An error occurred: ${error.message}`);
    }
}

main();