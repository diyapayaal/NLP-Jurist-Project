import json
import os
import time
from google import genai
from dotenv import load_dotenv
from .helpers import clean_json_response, parse_json_safely, validate_regulation_response, normalize_response

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

client = genai.Client(api_key=API_KEY)


def analyze_regulation(regulation_text: str) -> dict:
    """
    Analyze regulation text and extract compliance requirements.
    
    Args:
        regulation_text: Full text of regulation to analyze
        
    Returns:
        Dictionary with regulation analysis including type, requirements, deadlines, etc.
        
    Raises:
        ValueError: If analysis fails or response is invalid
    """
    try:
        # Truncate regulation text to limit Gemini token load (temporary demo stability fix)
        # Adjust this value to 4000 if 8000 is still too large.
        regulation_text = regulation_text[:4000]

        # Load prompt template
        with open("prompts/regulation_prompt.txt", "r", encoding="utf-8") as f:
            prompt_template = f.read()

        prompt = prompt_template.replace("{regulation_text}", regulation_text)

        # Call Gemini API
        time.sleep(2)  # Brief pause to avoid rate limits during testing
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # Clean and parse response
        response_text = response.text.strip()
        clean_json = clean_json_response(response_text)
        analysis = parse_json_safely(clean_json)
        
        # Validate response structure
        validate_regulation_response(analysis)
        
        # Normalize data
        analysis = normalize_response(analysis)
        
        return analysis
    
    except Exception as e:
        raise ValueError(f"Failed to analyze regulation: {str(e)}")