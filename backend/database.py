import os #built in library
import pymysql
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = os.getenv("MYSQL_PORT")
MYSQL_DB = os.getenv("MYSQL_DB")


# connect to MySQL server 

server_url = f"{MYSQL_HOST}"
server_port = int(MYSQL_PORT)

# conn to db , create db if missing
try:
    conn = pymysql.connect(
        host=server_url,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        port=server_port,
        autocommit=True
    )
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DB};")
    cursor.close()
    conn.close()
    print(f"✔ Database '{MYSQL_DB}' ready.")
except Exception as e:
    print("❌ Failed to create/check database:", e)
    raise


# Create SQLAlchemy engine using the DB

DATABASE_URL = (
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}"
    f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
)
# Pooling
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base() #MODEL PARENT



# Dependency for FastAPI endpoints
#CRUD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
