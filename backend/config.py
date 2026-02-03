from dotenv import load_dotenv
import os
import cloudinary

# Load environment variables from .env
load_dotenv()

# -------------------------
# Database
# -------------------------
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

# -------------------------
# Local temp paths
# (used only during request lifecycle)
# -------------------------
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "app/data/uploads")
RESULTS_DIR = os.getenv("RESULTS_DIR", "app/data/results")

# Ensure directories exist (safe on Render)
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

# -------------------------
# Cloudinary configuration
# -------------------------
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

if not all([
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
]):
    raise RuntimeError("Cloudinary environment variables are not fully set")

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
    secure=True
)
