import pdfplumber
import os

def extract_pdf_text(pdf_path):
    try:
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")

        text = ""

        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                extracted = page.extract_text()

                if extracted:
                    text += f"\n--- Page {page_num} ---\n{extracted}"

        if not text.strip():
            raise ValueError("No extractable text found in PDF")

        return text

    except Exception as e:
        raise Exception(f"PDF extraction error: {str(e)}")