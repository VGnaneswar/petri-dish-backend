from dotenv import load_dotenv
import os
import cloudinary

load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL")

# Local paths (still used for temp processing)
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "app/data/uploads")
RESULTS_DIR = os.getenv("RESULTS_DIR", "app/data/results")
MODEL_PATH = os.getenv("MODEL_PATH", "models/best.pt")
MODEL_URL = os.getenv("MODEL_URL")

# Cloudinary
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

# Configure Cloudinary ONCE
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
    secure=True
)
