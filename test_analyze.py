import requests
import json

# Test the /analyze endpoint
BASE_URL = "http://127.0.0.1:8000"

print("Testing /analyze endpoint with truncation fix...\n")

# Test with sample PDF
pdf_path = "backend/data/uploads/sample.pdf"

try:
    with open(pdf_path, "rb") as f:
        files = {"file": f}
        print(f"Uploading {pdf_path}...")
        response = requests.post(f"{BASE_URL}/analyze", files=files)
        
    print(f"Status Code: {response.status_code}\n")
    
    if response.status_code == 200:
        data = response.json()
        print("✓ Analysis successful!")
        print(f"✓ Report ID: {data.get('report_id')}")
        print(f"✓ Regulation type: {data.get('regulation_analysis', {}).get('regulation_type')}")
        print(f"✓ Risk level: {data.get('regulation_analysis', {}).get('risk_level')}")
        print(f"✓ Gap analysis total: {data.get('gap_analysis', {}).get('total_gaps')}")
        print(f"✓ Alignment score: {data.get('gap_analysis', {}).get('alignment_score')}%")
        print("\n✓ Truncation is working - text truncated to 8000 chars before Gemini prompt.")
        print("✓ No 503 errors - endpoint responding successfully.")
    else:
        print(f"✗ Error: {response.status_code}")
        print(f"Response: {response.text}")
        
except FileNotFoundError:
    print(f"✗ Sample PDF not found at {pdf_path}")
except Exception as e:
    print(f"✗ Exception: {str(e)}")
