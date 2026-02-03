
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pathlib import Path
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parents[2]
env_path = BASE_DIR / ".env"

if env_path.exists():
    load_dotenv(env_path)
else:
    load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL not set. Please check your .env file for Aiven MySQL credentials."
    )


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,    
    pool_recycle=1800,     
    pool_size=5,
    max_overflow=10,
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
