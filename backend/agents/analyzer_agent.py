from datetime import datetime
from pathlib import Path
import os

from fastapi import HTTPException
from PIL import Image, ImageDraw, ImageFont
import cloudinary.uploader

from backend.database.connection import SessionLocal
from backend.database.models import ImageRecord, DetectionRecord
from backend.config import RESULTS_DIR
from backend.agents.processor_agent import get_model


def analyze_image(img_path: str, folder_name: str, filename: str):
    db = SessionLocal()

    try:
        image_record = ImageRecord(
            filename=filename,
            folder_path=os.path.dirname(img_path),
            upload_time=datetime.utcnow(),
            colony_count=0
        )
        db.add(image_record)
        db.flush()

        model = get_model()
        results = model(img_path)[0]

        output_folder = Path(RESULTS_DIR) / folder_name
        output_folder.mkdir(parents=True, exist_ok=True)
        output_path = output_folder / f"result_{filename}"

        image = Image.open(img_path).convert("RGB")
        draw = ImageDraw.Draw(image)
        font = ImageFont.load_default()

        names = results.names if hasattr(results, "names") else {}
        colony_count = 0

        for box in results.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            class_name = names.get(cls, str(cls))

            colony_count += 1

            draw.rectangle([x1, y1, x2, y2], outline="red", width=2)
            draw.text((x1, y1 - 10), f"{class_name} {conf:.2f}", fill="red", font=font)

            db.add(
                DetectionRecord(
                    image_id=image_record.id,
                    class_name=class_name,
                    confidence=conf,
                    x1=x1,
                    y1=y1,
                    x2=x2,
                    y2=y2
                )
            )

        image.save(output_path)

        upload = cloudinary.uploader.upload(
            str(output_path),
            folder="petri_dish_results",
            public_id=f"{folder_name}_result",
            overwrite=True
        )

        image_record.output_image_url = upload["secure_url"]
        image_record.colony_count = colony_count

        db.commit()
        db.refresh(image_record)

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
