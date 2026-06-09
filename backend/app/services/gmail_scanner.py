import requests

GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me"

def get_gmail_messages(access_token: str, max_results: int = 500) -> dict:
    response = requests.get(
        f"{GMAIL_BASE}/messages",
        headers={"Authorization": f"Bearer {access_token}"},
        params={"maxResults": max_results}
    )
    return response.json()

def get_message_details(access_token: str, message_id: str) -> dict:
    response = requests.get(
        f"{GMAIL_BASE}/messages/{message_id}",
        headers={"Authorization": f"Bearer {access_token}"},
        params={"format": "metadata", "metadataHeaders": ["From", "To"]}
    )
    return response.json()

def extract_sender_from_headers(headers: list) -> str:
    for h in headers:
        if h.get("name", "").lower() == "from":
            return h.get("value", "")
    return ""