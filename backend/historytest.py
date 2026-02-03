import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database.connection import SessionLocal
from backend.database.models import ImageRecord

db = SessionLocal()
images = db.query(ImageRecord).all()

print(f"Total records: {len(images)}")
for img in images:
    print(img.id, img.filename, img.upload_time, img.folder_path)
