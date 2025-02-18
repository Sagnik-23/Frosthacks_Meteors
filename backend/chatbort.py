import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Retrieve API credentials
API_KEY = os.getenv("GEM_API_KEY")
MODEL_NAME = os.getenv("GEM_MODEL", "gemini-pro")  # Default model

# Check if API Key exists
if not API_KEY:
    raise ValueError("API Key is missing! Set GEM_API_KEY in .env file.")

# Configure Gemini API
os.environ["GENABLE_GRPC"] = "False"  # Force HTTP instead of gRPC
genai.configure(api_key=API_KEY)

# Initialize the Gemini model
model = genai.GenerativeModel(MODEL_NAME)

# Function to process extracted text and return structured medical data
def ai_response(medical_data, query):
    # Convert medical data dictionary to a formatted string
    data_str = json.dumps(medical_data, indent=2)  # Make JSON readable

    # Create the natural language prompt
    prompt = f"""
    Here are my medicine details in JSON format:
    {data_str}

    Based on these details, I have the following question: {query}
    
    Please provide a valid answer considering the provided information.
    """

    try:
        # Send request to Gemini API (must be a text string, NOT JSON)
        response = model.generate_content(prompt)

        # Extract AI-generated response text
        generated_text = response.text  

        return generated_text  # Return response

    except Exception as e:
        return f"❌ Error: {e}"

