"""
This code will sell 2 or any amount ADA or any code
E.g on code 2 ADA
You can change it on lines 20-32 
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

    # SELL
    "type": "0",

    # MARKET
    "category_type": "1",

    # Amount of ADA to sell
    "amount": "2"
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