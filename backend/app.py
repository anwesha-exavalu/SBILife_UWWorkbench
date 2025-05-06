import os
import shutil
import uuid
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager

from google_vision import extract_data_from_gemini_vision


UPLOAD_DIR = "./uploads"
TEMP_DIR = "./temp"
OUTPUT_DIR = "./output"

# Required Folders creation and deletion
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Cleanup old files and recreate directories
    for dir_path in [UPLOAD_DIR, TEMP_DIR, OUTPUT_DIR]:
        if os.path.exists(dir_path):
            shutil.rmtree(dir_path)  # Remove everything
        os.makedirs(dir_path, exist_ok=True)  # Recreate empty directories
    yield
    # Cleanup on shutdown
    for dir_path in [UPLOAD_DIR, TEMP_DIR, OUTPUT_DIR]:
        try:
            shutil.rmtree(dir_path)
        except Exception as e:
            print(f"Error cleaning up {dir_path}: {e}")


app = FastAPI(
    title="Email Processing API",
    description="API for processing emails and attachments",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",  # Custom URL for Swagger UI
)


# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to the Email Processing API!"}


@app.post("/extract_data/form16")
async def upload_file(file: UploadFile = File(...)):
    submission_id = uuid.uuid4().hex
    submission_dir = os.path.join(UPLOAD_DIR, submission_id)
    os.makedirs(submission_dir, exist_ok=True)
    file_path = os.path.join(submission_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    prompt="Extract FY,Gross Salary,Employee Name,Company Name,Insurance Deductions from the document in proper JSON format"
    response = extract_data_from_gemini_vision(file_path, submission_id,prompt)
    return {"response": response}

@app.post("/extract_data/bankstatement")
async def upload_file(file: UploadFile = File(...)):
    submission_id = uuid.uuid4().hex
    submission_dir = os.path.join(UPLOAD_DIR, submission_id)
    os.makedirs(submission_dir, exist_ok=True)
    file_path = os.path.join(submission_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    prompt="Extract April 8, April 10 and April 12 balance from the document in proper JSON format"
    response = extract_data_from_gemini_vision(file_path, submission_id,prompt)
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
 