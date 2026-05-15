"""
Helper functions for compliance analysis - promoting DRY principles and code reusability.
"""

import json
import re
import os
from typing import Dict, Any, Optional
from datetime import datetime


def clean_json_response(response_text: str) -> str:
    """
    Clean LLM response by removing markdown code blocks and syntax.
    
    Args:
        response_text: Raw response from LLM
        
    Returns:
        Clean JSON string
    """
    if response_text.startswith("```"):
        # Extract content between code fences
        match = re.search(r"```(?:json)?\s*(.*?)\s*```", response_text, re.DOTALL)
        if match:
            response_text = match.group(1)
        else:
            # Fallback: split by ``` and take middle part
            parts = response_text.split("```")
            if len(parts) >= 3:
                response_text = parts[1]
    
    # Remove common prefixes
    response_text = response_text.replace("json", "", 1).strip()
    response_text = response_text.lstrip()
    
    return response_text


def parse_json_safely(json_str: str) -> Dict[str, Any]:
    """
    Safely parse JSON with error handling and cleanup.
    
    Args:
        json_str: JSON string to parse
        
    Returns:
        Parsed dictionary or empty dict on failure
        
    Raises:
        ValueError: If JSON is invalid
    """
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON response from LLM: {str(e)}")


def validate_regulation_response(data: Dict[str, Any]) -> bool:
    """
    Validate that regulation analysis has all required fields.
    
    Args:
        data: Response data to validate
        
    Returns:
        True if valid, raises ValueError otherwise
    """
    required_fields = [
        "regulation_type",
        "summary",
        "deadline",
        "risk_level",
        "affected_departments",
        "key_requirements",
        "measurable_action_points",
    ]
    
    missing = [f for f in required_fields if f not in data]
    if missing:
        raise ValueError(f"Missing required fields in regulation analysis: {missing}")
    
    return True


def validate_gap_response(data: Dict[str, Any]) -> bool:
    """
    Validate that gap analysis has all required fields.
    
    Args:
        data: Response data to validate
        
    Returns:
        True if valid, raises ValueError otherwise
    """
    required_fields = [
        "gaps",
        "alignment_score",
        "total_gaps",
        "remediation_priority",
    ]
    
    missing = [f for f in required_fields if f not in data]
    if missing:
        raise ValueError(f"Missing required fields in gap analysis: {missing}")
    
    # Validate alignment score is 0-100
    if not isinstance(data["alignment_score"], (int, float)) or not 0 <= data["alignment_score"] <= 100:
        raise ValueError("alignment_score must be between 0 and 100")
    
    return True


def normalize_severity(severity: str) -> str:
    """
    Normalize severity values to lowercase for consistency.
    
    Args:
        severity: Severity value to normalize
        
    Returns:
        Lowercase severity value
    """
    severity_map = {
        "critical": "critical",
        "Critical": "critical",
        "CRITICAL": "critical",
        "high": "high",
        "High": "high",
        "HIGH": "high",
        "medium": "medium",
        "Medium": "medium",
        "MEDIUM": "medium",
        "low": "low",
        "Low": "low",
        "LOW": "low",
    }
    return severity_map.get(severity, "medium")


def normalize_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize response data for consistency across analyses.
    
    Args:
        data: Raw response data
        
    Returns:
        Normalized data
    """
    # Normalize severity fields
    for gap in data.get("gaps", []):
        if "severity" in gap:
            gap["severity"] = normalize_severity(gap["severity"])
    
    for item in data.get("remediation_priority", []):
        if "priority" in item:
            item["priority"] = normalize_severity(item["priority"])
    
    return data


def generate_report_filename(regulation_type: str) -> str:
    """
    Generate standardized report filename.
    
    Args:
        regulation_type: Type of regulation analyzed
        
    Returns:
        Filename with timestamp
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    # Sanitize regulation type for filename
    safe_name = re.sub(r"[^\w\s-]", "", regulation_type)[:50]
    safe_name = re.sub(r"\s+", "_", safe_name).lower()
    return f"compliance_report_{safe_name}_{timestamp}.json"


def save_report(report_data: Dict[str, Any], report_dir: str = "reports") -> str:
    """
    Save report to JSON file with proper metadata.
    
    Args:
        report_data: Complete report to save
        report_dir: Directory to save reports
        
    Returns:
        Path to saved report file
    """
    os.makedirs(report_dir, exist_ok=True)
    
    filename = generate_report_filename(report_data.get("regulation_analysis", {}).get("regulation_type", "unknown"))
    filepath = os.path.join(report_dir, filename)
    
    # Add metadata
    report_data["metadata"] = {
        "created_at": datetime.now().isoformat(),
        "version": "1.0",
        "format": "compliance_report"
    }
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)
    
    return filepath


def load_report(filepath: str) -> Dict[str, Any]:
    """
    Load report from JSON file.
    
    Args:
        filepath: Path to report file
        
    Returns:
        Report data
    """
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def list_reports(report_dir: str = "reports", limit: int = 50) -> list:
    """
    List all reports in directory with metadata.
    
    Args:
        report_dir: Directory containing reports
        limit: Maximum reports to return
        
    Returns:
        List of report metadata
    """
    if not os.path.exists(report_dir):
        return []
    
    reports = []
    for filename in sorted(os.listdir(report_dir), reverse=True)[:limit]:
        if filename.endswith(".json"):
            filepath = os.path.join(report_dir, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    reports.append({
                        "id": filename.replace(".json", ""),
                        "filename": filename,
                        "title": data.get("regulation_analysis", {}).get("regulation_type", "Unknown"),
                        "created_at": data.get("metadata", {}).get("created_at", ""),
                        "alignment_score": data.get("gap_analysis", {}).get("alignment_score", 0),
                        "total_gaps": data.get("gap_analysis", {}).get("total_gaps", 0),
                    })
            except (json.JSONDecodeError, IOError):
                pass
    
    return reports
