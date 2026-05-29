"""
This code Will Help You sell All Balance (Selected Coin)
You can change coin base on line 64-70
For More information please read API.md
"""

import requests
import hashlib
import hmac
from urllib.parse import urlencode

API_KEY = input("Please Enter Your API Key : ")
SECRET_KEY = input("Please Enter Your Secret Key : ")

# =========================
# GET WALLET BALANCE (correct endpoint)
# =========================
wallet_url = "https://rest.bit24.cash/asset/capi/v1/wallet/assets"
wallet_headers = {
    "Accept": "application/json",
    "X-BIT24-APIKEY": API_KEY
}

# Fetch all assets with positive balances, excluding IRT (fiat)
wallet_params = {
    "without_irt": "0",    # include IRT? 0 = include all, 1 = exclude IRT
    "without_zero": "1"    # only show coins with balance > 0
}
wallet_response = requests.get(
    wallet_url,
    headers=wallet_headers,
    params=wallet_params
)

if wallet_response.status_code != 200:
    print("Wallet fetch failed:")
    print(wallet_response.text)
    exit()

wallet_data = wallet_response.json()
# The data structure has "data" -> "asset" (an array)
assets = wallet_data.get("data", {}).get("asset", [])

# =========================
# FIND ADA BALANCE (available balance)
# =========================
ada_available = 0.0

for coin in assets:
    if coin["symbol"] == "ADA":
        ada_available = float(coin["available_balance"])
        break

print(f"ADA available balance: {ada_available}")

if ada_available <= 0:
    print("No ADA available to sell.")
    exit()

# =========================
# SELL ALL ADA (market sell)
# =========================
sell_url = "https://rest.bit24.cash/pro/capi/v1/orders/submit"

params = {
    "base_coin_symbol": "ADA",
    "quote_coin_symbol": "IRT",
    "type": "0",              # 0 = sell
    "category_type": "1",     # 1 = market (instant)
    "amount": str(ada_available)   # sell entire available balance
}

# Build signature: sort keys alphabetically, join with '&', HMAC-SHA256
query_string = "&".join(f"{k}={params[k]}" for k in sorted(params))
signature = hmac.new(
    SECRET_KEY.encode('utf-8'),
    query_string.encode('utf-8'),
    hashlib.sha256
).hexdigest()

params["signature"] = signature

sell_headers = {
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    "X-BIT24-APIKEY": API_KEY
}

sell_response = requests.post(
    sell_url,
    headers=sell_headers,
    data=params
)

print("Sell response status:", sell_response.status_code)
print(sell_response.text)

if sell_response.status_code == 200:
    resp_json = sell_response.json()
    if resp_json.get("success"):
        print(f"Order placed successfully! Order ID: {resp_json['data']['order']['id']}")
    else:
        print(f"Order error: {resp_json.get('error')}")