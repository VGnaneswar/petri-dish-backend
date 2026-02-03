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
        db.flush()

        # 2️⃣ Upload ORIGINAL image to Cloudinary
        upload = cloudinary.uploader.upload(
            img_path,
            folder="petri_dish_inputs",
            public_id=folder_name,
            overwrite=True
        )

        image_url = upload["secure_url"]

        # 3️⃣ Call Hugging Face YOLO
        response = requests.post(
            HF_YOLO_URL,
            json={"image_url": image_url},
            timeout=60
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="YOLO inference failed")

        data = response.json()

        # 4️⃣ Save detections
        colony_count = data["count"]

        for det in data["detections"]:
            db.add(
                DetectionRecord(
                    image_id=image_record.id,
                    class_name=det["class_name"],
                    confidence=det["confidence"],
                    x1=det["bbox"][0],
                    y1=det["bbox"][1],
                    x2=det["bbox"][2],
                    y2=det["bbox"][3],
                )
            )

        image_record.colony_count = colony_count
        image_record.output_image_url = image_url

        db.commit()
        db.refresh(image_record)

        # 5️⃣ Cleanup local file
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
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()
