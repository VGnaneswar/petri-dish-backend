from backend.database.connection import engine

conn = engine.connect()
print(conn.execute("SELECT version();").fetchone())
conn.close()
