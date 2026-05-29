"""
This Code Will Buy 2 ADA or Any coin you want 
One line 82-85 You can Change a Coin and Buy amount  
For More information read a API.md
"""


import requests
import hmac
import hashlib
from urllib.parse import urlencode

API_KEY = input("Please Enter You API Key : ")
SECRET_KEY = input("Please Enter You Secret Key : ")
BASE_URL = "https://rest.bit24.cash"

def sign_params(params: dict) -> str:
    """
    Create HMAC‑SHA256 signature for the given parameters.
    Parameters are sorted alphabetically, joined with '&', then signed.
    """
    params_to_sign = {k: v for k, v in params.items() if k != "signature"}
    sorted_params = sorted(params_to_sign.items())
    query_string = "&".join(f"{k}={v}" for k, v in sorted_params)
    signature = hmac.new(
        SECRET_KEY.encode('utf-8'),
        query_string.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return signature

def get_best_ask(symbol_base: str, symbol_quote: str) -> str:
    """
    Return the best ask price as a string (exactly as returned by the API).
    """
    url = f"{BASE_URL}/pro/capi/v1/markets/order-books"
    headers = {
        "Accept": "application/json",
        "X-BIT24-APIKEY": API_KEY,
    }
    params = {"base_coin": symbol_base, "quote_coin": symbol_quote}
    resp = requests.get(url, headers=headers, params=params)
    resp.raise_for_status()
    data = resp.json()
    if not data.get("success"):
        raise Exception(f"Order book error: {data.get('error')}")

    sell_orders = data["data"]["sell_orders"]
    if not sell_orders:
        raise Exception("No sell orders available.")
    # Return the price string directly – no float conversion!
    return sell_orders[0]["price"]

def submit_limit_buy_order(symbol_base: str, symbol_quote: str, amount: str, price: str):
    """
    Place a limit buy order. amount and price are strings.
    """
    url = f"{BASE_URL}/pro/capi/v1/orders/submit"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-BIT24-APIKEY": API_KEY,
    }

    params = {
        "base_coin_symbol": symbol_base,
        "quote_coin_symbol": symbol_quote,
        "type": "1",               # buy
        "category_type": "0",      # limit
        "price": price,
        "amount": amount,
    }

    params["signature"] = sign_params(params)

    resp = requests.post(url, headers=headers, data=params)
    # If not OK, print the response to see the exact validation error
    if not resp.ok:
        print("Server responded with error:")
        print(resp.text)
    resp.raise_for_status()
    return resp.json()

def buy_2_ada_on_irt():
    base = "ADA"
    quote = "IRT"
    amount = "2"            # send as simple integer string

    print("Fetching best ask for ADA/IRT ...")
    best_ask_str = get_best_ask(base, quote)
    print(f"Best ask price (raw): {best_ask_str} IRT")

    print(f"Placing limit buy order for {amount} ADA at {best_ask_str} IRT ...")
    response = submit_limit_buy_order(base, quote, amount, best_ask_str)

    if response.get("success"):
        order = response["data"]["order"]
        print(f"Order placed successfully! Order ID: {order['id']}")
        print(f"Status: {order['status_text']}")
        print(f"Price: {order['each_price']} IRT, Amount: {order['amount']} ADA")
        print(f"Total: {order['total']} IRT")
    else:
        print(f"Order failed: {response.get('error')}")

if __name__ == "__main__":
    try:
        buy_2_ada_on_irt()
    except Exception as e:
        print(f"An error occurred: {e}")