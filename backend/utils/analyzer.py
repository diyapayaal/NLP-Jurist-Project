import json
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

client = genai.Client(api_key=API_KEY)

def analyze_regulation(regulation_text):

    with open("prompts/regulation_prompt.txt", "r", encoding="utf-8") as f:
        prompt_template = f.read()

    prompt = prompt_template.replace(
        "{regulation_text}", regulation_text
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    response_text = response.text.strip()

    if response_text.startswith("```"):
        response_text = response_text.split("```")[1]
        response_text = response_text.replace("json", "").strip()

    return json.loads(response_text)