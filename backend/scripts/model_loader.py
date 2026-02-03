import os
import requests
from backend.config import MODEL_PATH, MODEL_URL


def ensure_model():
    if os.path.exists(MODEL_PATH):
        return

    if not MODEL_URL:
        raise RuntimeError("MODEL_URL is not set")

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    r = requests.get(MODEL_URL, stream=True)
    r.raise_for_status()

    with open(MODEL_PATH, "wb") as f:
        for chunk in r.iter_content(chunk_size=8192):
            f.write(chunk)
