from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from backend.database.connection import SessionLocal
from backend.database.models import ImageRecord
from backend.agents.ingestor_agent import router as ingestor_router
from dotenv import load_dotenv
from backend.scripts.model_loader import ensure_model

import os

# ✅ Load environment variables
load_dotenv()

app = FastAPI(
    title="Petri Dish Image Processing API",
    description="API for uploading, processing, and retrieving bacterial colony detection results.",
    version="1.0.0"
)

# ✅ Include ingestor router
app.include_router(ingestor_router)

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Use environment-based folders
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "app/data/uploads")
RESULTS_DIR = os.getenv("RESULTS_DIR", "app/data/results")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)



@app.on_event("startup")
def startup_event():
    ensure_model()

@app.get("/")
def root():
    return {"message": "✅ Petri Dish Detection API is running successfully!"}

# ✅ Retrieve processed image by ID
@app.get("/output/{image_id}")
def get_output_image(image_id: int, db: Session = Depends(get_db)):
    image = db.query(ImageRecord).filter(ImageRecord.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    return {
    "id": image.id,
    "filename": image.filename,
    "upload_time": image.upload_time,
    "output_image_url": image.output_image_url,
    "folder_path": image.folder_path
    }


@app.get("/count/{image_id}")
def get_colony_count(image_id: int, db: Session = Depends(get_db)):
    image = db.query(ImageRecord).filter(ImageRecord.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"image_id": image.id, "colony_count": image.colony_count}

@app.get("/history")
def get_all_images(db: Session = Depends(get_db)):
    try:
        images = db.query(ImageRecord).order_by(ImageRecord.upload_time.desc()).all()
        if not images:
            return []

        history_data = []
        for img in images:
            history_data.append({
                "id": img.id,
                "filename": img.filename or "Unknown",
                "upload_time": img.upload_time.isoformat() if img.upload_time else "N/A",

                # ✅ colony count included
                "colony_count": img.colony_count,

            
                "output_image_url": img.output_image_url,

                # ✅ for frontend static retrieval
                "folder_path": img.folder_path,

                # ✅ include detections if needed
                "detections": [
                    {
                        "class_name": d.class_name,
                        "confidence": d.confidence,
                        "box": [d.x1, d.y1, d.x2, d.y2]
                    }
                    for d in img.detections
                ]
            })

        return history_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")
