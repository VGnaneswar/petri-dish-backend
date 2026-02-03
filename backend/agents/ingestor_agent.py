from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
from datetime import datetime
import os

from backend.agents.analyzer_agent import analyze_image
from backend.config import UPLOAD_DIR

router = APIRouter(prefix="/ingest", tags=["Ingestor"])

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/petri-dish")
async def ingest_petri_image(file: UploadFile = File(...)):
    try:
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        folder_name = f"{timestamp}_{Path(file.filename).stem}"
        upload_folder = Path(UPLOAD_DIR) / folder_name
        upload_folder.mkdir(parents=True, exist_ok=True)

        img_path = upload_folder / file.filename
        with img_path.open("wb") as f:
            f.write(await file.read())

        return analyze_image(str(img_path), folder_name, file.filename)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
