import requests
from app.core import config
from typing import Dict

def fetch_api_data(api_base_url: str, bearer_token: str, api_key: str) -> Dict:
    headers = {
        "Authorization": f"Bearer {bearer_token}",
        "x-Api-Key": api_key,
        "Accept": "application/json"
    }

    if bearer_token:  # only add if not empty
        headers["Authorization"] = f"Bearer {bearer_token}"
    if api_key:       # only add if not empty
        headers["x-Api-Key"] = api_key
    
    try:
        response = requests.post(api_base_url, headers=headers, timeout=10)
        response.raise_for_status()
        return {
            "status": "success",
            "data": response.json()
        }
    except requests.RequestException as e:
        return {
            "status": "error",
            "data": {"message": str(e)}
        }