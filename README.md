# NLP-Jurist: Compliance Gap Analyzer

A retrieval-augmented generation (RAG) system that analyzes legal regulations and identifies compliance gaps against bank policies.

## Features

✅ **PDF Regulation Extraction** - Extracts text from RBI regulations or legal documents  
✅ **Regulation Analysis** - Parses regulations into structured components  
✅ **Policy Comparison** - Compares against existing bank policies  
✅ **Gap Identification** - Identifies compliance gaps with severity levels  
✅ **Measurable Action Points** - Creates actionable compliance items with timelines  
✅ **Structured Output** - Generates JSON reports for downstream processing  

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure API Key
Edit `.env` file and add your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikeys

### 3. Prepare Input Files
- **sample.pdf** - Your legal regulation PDF file
- **bank_policies.json** - Your bank's existing policies (template provided)

## Usage

```bash
python main.py
```

## Output

The program generates:
- **compliance_report_YYYYMMDD_HHMMSS.json** - Comprehensive analysis report with:
  - Regulation analysis (type, summary, deadline, risk level, etc.)
  - Gap analysis (identified gaps, alignment score, severity levels)
  - Action items (measurable, owner-assigned compliance tasks)

## Report Structure

```json
{
  "timestamp": "ISO timestamp",
  "regulation_analysis": {
    "regulation_type": "...",
    "summary": "...",
    "deadline": "...",
    "risk_level": "High/Medium/Low",
    "affected_departments": ["..."],
    "measurable_action_points": [
      {
        "action": "...",
        "owner": "department",
        "timeline": "...",
        "success_metric": "..."
      }
    ]
  },
  "gap_analysis": {
    "gaps": [...],
    "alignment_score": 0-100,
    "total_gaps": number
  }
}
```

## Error Handling

The program includes comprehensive error handling for:
- Missing PDF files
- Unreadable PDFs
- API failures
- Invalid policy files
- JSON parsing errors

## Architecture

1. **Extraction Phase** - Extracts raw text from PDF regulations
2. **Analysis Phase** - Uses Gemini LLM to structure regulation data
3. **Comparison Phase** - Loads existing bank policies
4. **Gap Analysis Phase** - Identifies differences and compliance gaps
5. **Reporting Phase** - Generates structured JSON report

## Security Notes

⚠️ Never commit the `.env` file with actual API keys  
⚠️ Use environment variables for sensitive data  
⚠️ Keep `bank_policies.json` updated with current policies  

## Troubleshooting

**"GEMINI_API_KEY environment variable not set"**
→ Make sure you've set the API key in the `.env` file

**"No extractable text found in PDF"**
→ Ensure the PDF contains selectable text (not scanned image)

**"Failed to parse LLM response as JSON"**
→ The LLM may have returned malformed JSON; try with a different regulation

## Future Enhancements

- [ ] Vector database for semantic policy search
- [ ] Multi-document analysis
- [ ] Timeline visualization
- [ ] Compliance dashboard
- [ ] Audit trail tracking
- [ ] Automated policy updates
