import json
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

client = genai.Client(api_key=API_KEY)

def load_existing_policies(policy_file="data/bank_policies.json"):

    if os.path.exists(policy_file):
        with open(policy_file, "r", encoding="utf-8") as f:
            return json.load(f)

    return {"policies": []}


def identify_gaps(regulation_analysis, existing_policies):

    with open("prompts/gap_prompts.txt", "r", encoding="utf-8") as f:
        prompt_template = f.read()

    prompt = prompt_template.replace(
        "{regulation_analysis}", json.dumps(regulation_analysis, indent=2)
    ).replace(
        "{existing_policies}", json.dumps(existing_policies, indent=2)
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