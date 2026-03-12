import cv2
from pathlib import Path

BASE = Path("backend/data/streak")

for split in ["train", "val"]:
    for cls in (BASE / split).iterdir():
        if not cls.is_dir():
            continue
        for img_path in cls.glob("*"):
            img = cv2.imread(str(img_path))
            if img is None:
                continue

            h, w = img.shape[:2]
            scale = 1024 / max(h, w)

            if scale < 1:
                img = cv2.resize(img, (int(w*scale), int(h*scale)))
                cv2.imwrite(str(img_path), img)

print("Resize complete")