import json
import os
from google import genai
from dotenv import load_dotenv
from .helpers import clean_json_response, parse_json_safely, validate_gap_response, normalize_response

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

client = genai.Client(api_key=API_KEY)


def load_existing_policies(policy_file: str = "data/bank_policies.json") -> dict:
    """
    Load existing bank policies from JSON file.
    
    Args:
        policy_file: Path to policies JSON file
        
    Returns:
        Dictionary of existing policies
    """
    if os.path.exists(policy_file):
        with open(policy_file, "r", encoding="utf-8") as f:
            return json.load(f)
    
    # Return empty structure if file doesn't exist
    return {"policies": []}


def identify_gaps(regulation_analysis: dict, existing_policies: dict) -> dict:
    """
    Identify compliance gaps between new regulation and existing policies.
    
    Args:
        regulation_analysis: Output from analyze_regulation()
        existing_policies: Dictionary of existing policies
        
    Returns:
        Dictionary with identified gaps and remediation priorities
        
    Raises:
        ValueError: If gap analysis fails or response is invalid
    """
    try:
        # Load prompt template
        with open("prompts/gap_prompts.txt", "r", encoding="utf-8") as f:
            prompt_template = f.read()

        prompt = prompt_template.replace(
            "{regulation_analysis}", json.dumps(regulation_analysis, indent=2)
        ).replace(
            "{existing_policies}", json.dumps(existing_policies, indent=2)
        )

        # Call Gemini API
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # Clean and parse response
        response_text = response.text.strip()
        clean_json = clean_json_response(response_text)
        gaps = parse_json_safely(clean_json)
        
        # Validate response structure
        validate_gap_response(gaps)
        
        # Normalize data
        gaps = normalize_response(gaps)
        
        return gaps
    
    except Exception as e:
        raise ValueError(f"Failed to identify gaps: {str(e)}")