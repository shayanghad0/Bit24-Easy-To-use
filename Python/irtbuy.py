"""
This Code Will Help you to buy ADA or Any Coin How many you want to spend on market price
E.g 200/000 IRT on this code 
You Can Edit it on line 19-31
For More information read a API.md
"""

import requests
import hashlib
import hmac
from urllib.parse import urlencode

API_KEY = input("Please Enter You API Key : ")
SECRET_KEY = input("Please Enter You Secret Key : ")

url = "https://rest.bit24.cash/pro/capi/v1/orders/submit"

params = {
    "base_coin_symbol": "ADA",
    "quote_coin_symbol": "IRT",

    # BUY
    "type": "1",

    # MARKET
    "category_type": "1",

    # Amount of IRT to spend
    "quote_coin_amount": "200000"
}

# Sort + encode
query = urlencode(sorted(params.items()))

# HMAC SHA256 signature
signature = hmac.new(
    SECRET_KEY.encode(),
    query.encode(),
    hashlib.sha256
).hexdigest()

params["signature"] = signature

headers = {
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    "X-BIT24-APIKEY": API_KEY
}

response = requests.post(
    url,
    headers=headers,
    data=params
)

print(response.status_code)
print(response.text)