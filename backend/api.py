from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
from utils.helpers import save_report, load_report, list_reports, normalize_response

app = FastAPI(
    title="NLP-Jurist API",
    description="AI-powered compliance gap analyzer for banking regulations",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "data/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("reports", exist_ok=True)


@app.get("/")
def home():
    """Health check endpoint."""
    return {
        "message": "NLP-Jurist API Running",
        "status": "operational",
        "version": "1.0.0"
    }


@app.post("/analyze")
async def analyze_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF regulation and analyze it for compliance gaps.
    
    Returns:
        Comprehensive compliance analysis with gaps, remediation priorities, and action items.
    """
    try:
        # Validate file
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        if file.size > 25 * 1024 * 1024:  # 25MB limit
            raise HTTPException(status_code=413, detail="File too large (max 25MB)")
        
        # Save uploaded file
        file_path = f"{UPLOAD_FOLDER}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Step 1: Extract text from PDF
        regulation_text = extract_pdf_text(file_path)
        
        if not regulation_text or len(regulation_text.strip()) < 100:
            raise HTTPException(status_code=400, detail="PDF extraction failed or PDF is too short")

        # Step 2: Analyze regulation
        regulation_analysis = analyze_regulation(regulation_text)
        print("\n===== REGULATION ANALYSIS =====")
        print(regulation_analysis)
        print("================================\n")
        # Step 3: Load existing policies
        existing_policies = load_existing_policies()

       
        # Step 4: Identify gaps
        gaps = identify_gaps(regulation_analysis, existing_policies)

        print("\n===== GAP ANALYSIS OUTPUT =====")
        print(gaps)
        print("================================\n")

        # Build comprehensive report
        report = {
            "timestamp": datetime.now().isoformat(),
            "filename": file.filename,
            "regulation_analysis": regulation_analysis,
            "gap_analysis": gaps,
            "action_items": regulation_analysis.get("measurable_action_points", [])
        }
        
        # Normalize and validate response
        report = normalize_response(report)
        
        # Save report
        report_path = save_report(report)
        
        # Add report path to response
        report["report_id"] = os.path.basename(report_path).replace(".json", "")
        
        return report
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


@app.get("/reports")
def get_report_history(limit: int = 50):
    """
    Fetch list of previous compliance analysis reports.
    
    Args:
        limit: Maximum number of reports to return
        
    Returns:
        List of report metadata sorted by date (newest first)
    """
    try:
        reports = list_reports(limit=limit)
        return {
            "total": len(reports),
            "reports": reports
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch reports: {str(e)}"
        )


@app.get("/reports/{report_id}")
def get_report_detail(report_id: str):
    """
    Fetch detailed view of a specific report.
    
    Args:
        report_id: Report identifier (filename without .json)
        
    Returns:
        Full report data with all analysis details
    """
    try:
        filepath = f"reports/{report_id}.json"
        
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Report not found")
        
        report = load_report(filepath)
        return report
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch report: {str(e)}"
        )