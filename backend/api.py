from fastapi import FastAPI, UploadFile, File
import shutil
import os
import json
from datetime import datetime

from utils.pdf_extractor import extract_pdf_text
from utils.analyzer import analyze_regulation
from utils.gap_detector import (
    load_existing_policies,
    identify_gaps
)

app = FastAPI()

UPLOAD_FOLDER = "data/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "NLP-Jurist API Running"}


@app.post("/analyze")
async def analyze_pdf(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    regulation_text = extract_pdf_text(file_path)

    regulation_analysis = analyze_regulation(regulation_text)

    existing_policies = load_existing_policies()

    gaps = identify_gaps(
        regulation_analysis,
        existing_policies
    )

    report = {
        "timestamp": datetime.now().isoformat(),
        "regulation_analysis": regulation_analysis,
        "gap_analysis": gaps,
        "action_items": regulation_analysis.get(
            "measurable_action_points",
            []
        )
    }

    return report