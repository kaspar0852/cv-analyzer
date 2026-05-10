import asyncio
import os
import asyncpg
from app.core.database import parse_connection_string

async def migrate():
    raw_conn_str = os.getenv("ConnectionStrings__DefaultConnection")
    parsed = parse_connection_string(raw_conn_str)
    
    DB_USER = parsed.get("username", "postgres")
    DB_PASS = parsed.get("password", "postgres")
    DB_HOST = parsed.get("host", "postgres-service")
    DB_NAME = "cv_reviewer_ai"
    
    print(f"Connecting to {DB_NAME} at {DB_HOST}...")
    
    conn = await asyncpg.connect(
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        database=DB_NAME
    )
    
    try:
        print("Adding 'raw_text' column to 'analyses' table...")
        await conn.execute('ALTER TABLE analyses ADD COLUMN IF NOT EXISTS raw_text TEXT')
        print("Success!")
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(migrate())
