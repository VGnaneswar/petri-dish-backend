from datetime import datetime
import os
import requests

from fastapi import HTTPException
import cloudinary.uploader

from backend.database.connection import SessionLocal
from backend.database.models import ImageRecord, DetectionRecord

# Hugging Face YOLO endpoint
HF_YOLO_URL = "https://gnaneswr-petri-dish-yolo.hf.space/predict"


def analyze_image(img_path: str, folder_name: str, filename: str):
    db = SessionLocal()

    try:
        # 1️⃣ Create DB record
        image_record = ImageRecord(
            filename=filename,
            folder_path=os.path.dirname(img_path),
            upload_time=datetime.utcnow(),
            colony_count=0
        )
        db.add(image_record)
        db.flush()  # get image_record.id

        # 2️⃣ Upload ORIGINAL image to Cloudinary
        upload = cloudinary.uploader.upload(
            img_path,
            folder="petri_dish_inputs",
            public_id=folder_name,
            overwrite=True,
            resource_type="image"
        )

        image_url = upload.get("secure_url")
        if not image_url:
            raise RuntimeError("Cloudinary upload failed for original image")

        # 3️⃣ Call Hugging Face YOLO
        response = requests.post(
            HF_YOLO_URL,
            json={"image_url": image_url},
            timeout=90
        )

        if response.status_code != 200:
            raise RuntimeError(
                f"HF YOLO failed: {response.status_code} {response.text}"
            )

        data = response.json()

        # 🔐 4️⃣ Validate HF response (THIS FIXES YOUR 500)
        if "count" not in data:
            raise RuntimeError(f"HF response missing 'count': {data}")

        if "detections" not in data:
            raise RuntimeError(f"HF response missing 'detections': {data}")

        if "output_image_url" not in data:
            raise RuntimeError(f"HF response missing 'output_image_url': {data}")

        colony_count = data["count"]

        # 5️⃣ Save detections
        for det in data["detections"]:
            if "bbox" not in det or len(det["bbox"]) != 4:
                continue  # skip malformed detection

            db.add(
                DetectionRecord(
                    image_id=image_record.id,
                    class_name=det.get("class_name", "unknown"),
                    confidence=float(det.get("confidence", 0)),
                    x1=float(det["bbox"][0]),
                    y1=float(det["bbox"][1]),
                    x2=float(det["bbox"][2]),
                    y2=float(det["bbox"][3]),
                )
            )

        # 6️⃣ Save final results
        image_record.colony_count = colony_count
        image_record.output_image_url = data["output_image_url"]

        db.commit()
        db.refresh(image_record)

        # 7️⃣ Cleanup local temp file
        if os.path.exists(img_path):
            os.remove(img_path)

        return {
            "image_id": image_record.id,
            "filename": filename,
            "upload_time": str(image_record.upload_time),
            "colony_count": colony_count,
            "output_image_url": image_record.output_image_url
        }

    except Exception as e:
        db.rollback()
        # 🔥 This error WILL now show real cause in Render logs
        raise HTTPException(status_code=500, detail=f"Analyze image failed: {str(e)}")

    finally:
        db.close()
