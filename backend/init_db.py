from backend.database.connection import engine
from backend.database.models import Base


def init_db():
    print("📦 Creating tables on Aiven MySQL...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully on Aiven MySQL!")


if __name__ == "__main__":
    init_db()
