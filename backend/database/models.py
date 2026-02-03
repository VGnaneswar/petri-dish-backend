# backend/database/models.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()


class ImageRecord(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)

    # Original uploaded filename
    filename = Column(String(255), nullable=False, index=True)

    # Folder used during processing (optional but fine to keep)
    folder_path = Column(String(512), nullable=False)

    upload_time = Column(DateTime, default=datetime.utcnow)

    # ✅ Cloudinary public URL (NO Base64, NO local dependency)
    output_image_url = Column(String(512), nullable=True)

    # Total detected colonies
    colony_count = Column(Integer, default=0)

    detections = relationship(
        "DetectionRecord",
        back_populates="image",
        cascade="all, delete-orphan",
        passive_deletes=True
    )


class DetectionRecord(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)

    image_id = Column(
        Integer,
        ForeignKey("images.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    class_name = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)

    x1 = Column(Float, nullable=False)
    y1 = Column(Float, nullable=False)
    x2 = Column(Float, nullable=False)
    y2 = Column(Float, nullable=False)

    image = relationship("ImageRecord", back_populates="detections")
