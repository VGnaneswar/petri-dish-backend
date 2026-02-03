#!/usr/bin/env python3
"""
Convert dataset JSON annotations into YOLOv8 .txt labels.

Input:
  Images: app/backend/data/images/{train,val,test}/
  JSONs:  app/backend/data/jsons/{empty,countable}/

Output:
  Labels: app/backend/data/labels/{train,val,test}/ in YOLO format
"""

import json
from pathlib import Path
from PIL import Image
from tqdm import tqdm

# Paths (relative to repo root)
IMAGES_DIR = Path("app/backend/data/images")
LABELS_DIR = Path("app/backend/data/labels")
JSONS_DIR = Path("app/backend/data/jsons")

# Hardcoded class map to match yolo_data.yaml
CLASS_MAP = {
    "P.aeruginosa": 0,
    "B.subtilis": 1,
    "E.coli": 2,
    "C.albicans": 3,
    "S.aureus": 4
}
print(f"[INFO] Using CLASS_MAP: {CLASS_MAP}")

def convert_annotation(json_path: Path, image_path: Path, out_label_path: Path):
    """Convert one JSON annotation to YOLO format .txt"""
    with open(json_path, "r") as f:
        ann = json.load(f)

    # Open image to get width/height
    with Image.open(image_path) as img:
        W, H = img.size

    lines = []
    unknown_classes = set()
    labels = ann.get("labels", [])
    if not labels:
        print(f"[DEBUG] No 'labels' found in {json_path.name}")
    for lab in labels:
        cls = lab.get("class")
        if cls not in CLASS_MAP:
            print(f"[DEBUG] Unknown class '{cls}' in {json_path.name}")
            unknown_classes.add(cls)
            continue
        class_id = CLASS_MAP[cls]

        # JSON gives top-left x,y and width,height
        try:
            x, y, w, h = lab["x"], lab["y"], lab["width"], lab["height"]
        except KeyError as e:
            print(f"[DEBUG] Missing key {e} in label for {json_path.name}")
            continue

        # Convert to YOLO normalized format
        x_center = (x + w / 2) / W
        y_center = (y + h / 2) / H
        w_norm = w / W
        h_norm = h / H

        lines.append(
            f"{class_id} {x_center:.6f} {y_center:.6f} {w_norm:.6f} {h_norm:.6f}"
        )

    if unknown_classes:
        print(f"[DEBUG] Encountered unknown classes in {json_path.name}: {unknown_classes}")

    # Write .txt (empty file if no labels)
    out_label_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_label_path, "w") as out:
        out.write("\n".join(lines))


def process_split(split: str):
    """Process one split (train/val/test)"""
    img_dir = IMAGES_DIR / split
    lbl_dir = LABELS_DIR / split
    lbl_dir.mkdir(parents=True, exist_ok=True)

    print(f"Processing {split} split...")
    for img_file in tqdm(
        list(img_dir.glob("*.jpg"))
        + list(img_dir.glob("*.JPG"))
        + list(img_dir.glob("*.jpeg"))
        + list(img_dir.glob("*.png"))
        + list(img_dir.glob("*.PNG"))
    ):
        base = img_file.stem
        # Look for JSON inside empty/ and countable/
        candidates = list(JSONS_DIR.glob(f"**/{base}.json"))
        if not candidates:
            print(f"⚠️ Warning: No JSON found for {img_file.name}")
            continue

        json_file = candidates[0]
        with open(json_file, "r") as f:
            ann = json.load(f)
        labels = ann.get("labels", [])
        print(f"[DEBUG] Image: {img_file.name} | JSON: {json_file.relative_to(JSONS_DIR)} | Labels found: {len(labels)}")
        out_label = lbl_dir / f"{base}.txt"
        convert_annotation(json_file, img_file, out_label)


if __name__ == "__main__":
    for split in ["train", "val", "test"]:
        process_split(split)
    print("✅ Conversion complete! Labels saved under app/backend/data/labels/")