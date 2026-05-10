import os
import asyncio
import asyncpg
import re
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

def parse_connection_string(conn_str: str):
    """Parses a .NET style connection string into a dictionary."""
    parts = {}
    for item in conn_str.split(';'):
        if '=' in item:
            key, value = item.split('=', 1)
            parts[key.strip().lower()] = value.strip()
    return parts

# Get the .NET style connection string from env
raw_conn_str = os.getenv("ConnectionStrings__DefaultConnection")

if raw_conn_str:
    parsed = parse_connection_string(raw_conn_str)
    DB_USER = parsed.get("username", "postgres")
    DB_PASS = parsed.get("password", "postgres")
    DB_HOST = parsed.get("host", "postgres-service")
    # Note: We still use our own isolated DB name for the AI service
    DB_NAME = "cv_reviewer_ai" 
else:
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASS = os.getenv("DB_PASS", "postgres")
    DB_HOST = os.getenv("DB_HOST", "postgres-service")
    DB_NAME = "cv_reviewer_ai"

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/{DB_NAME}"

_engines = {}
_sessionmakers = {}

def get_engine():
    loop = asyncio.get_event_loop()
    if loop not in _engines:
        _engines[loop] = create_async_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
    return _engines[loop]

def get_sessionmaker():
    loop = asyncio.get_event_loop()
    if loop not in _sessionmakers:
        _sessionmakers[loop] = async_sessionmaker(get_engine(), class_=AsyncSession, expire_on_commit=False)
    return _sessionmakers[loop]

class Base(DeclarativeBase):
    pass

async def get_db():
    async with get_sessionmaker()() as session:
        yield session

from contextlib import asynccontextmanager

@asynccontextmanager
async def get_session():
    async with get_sessionmaker()() as session:
        try:
            yield session
        finally:
            await session.close()

async def ensure_database_exists():
    """Connects to the default 'postgres' database to ensure the target DB exists."""
    # Use 'postgres' or 'template1' as the maintenance DB name
    maint_url = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/postgres"
    
    try:
        conn = await asyncpg.connect(maint_url)
        
        exists = await conn.fetchval(
            f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'"
        )
        
        if not exists:
            # CREATE DATABASE cannot run inside a transaction
            await conn.execute(f'CREATE DATABASE "{DB_NAME}"')
            print(f"Database '{DB_NAME}' created successfully.")
        
        await conn.close()
    except Exception as e:
        print(f"Warning during database check: {e}")
