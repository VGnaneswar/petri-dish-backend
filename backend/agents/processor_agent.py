from ultralytics import YOLO
import threading
from backend.config import MODEL_PATH

_model = None
_lock = threading.Lock()


def get_model():
    global _model
    with _lock:
        if _model is None:
            _model = YOLO(MODEL_PATH)
        return _model


def process_image(image_path: str):
    model = get_model()
    results = model(image_path)
    return results[0]
