from get_medicine import *
import chardet

# Flask backend server
from flask import Flask, request, jsonify
from flask_cors import CORS

# Azure Document AI
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeResult, AnalyzeDocumentRequest

from dotenv import load_dotenv
load_dotenv()

key = os.getenv("DI_KEY")
endpoint = os.getenv("DI_ENDPOINT")

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10Mb

CORS(app)  # Allowing all origins TODO: remove in production
# CORS(app, resources={
#      r"/*": {"origins": "https://e951-2405-201-9000-a088-48dd-75db-79c6-130b.ngrok-free.app/scan/"}})


def extrect_text(file):
    # print("✅ extrect_text call successfully")
    # # sample document
    # # formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png"

    client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )
    # with open(file_path,"rb") as file:
    poller = client.begin_analyze_document(
        "prebuilt-read", body=file)

    result: AnalyzeResult = poller.result()
    # print(result.content)

    text = result.content.encode("utf-8", errors="replace").decode("utf-8")
    print(text)
    with open("output/result_content.txt", "w") as output_file:
        output_file.write(text)
        output_file.close()

    with open("output/result_content.txt","rb") as f:
        raw_data = f.read()
        result = chardet.detect(raw_data)
        encoding = result["encoding"]
    text = raw_data.decode(encoding, errors="replace") 
    # print(text)


    data = get_medical_data(text)  # Convert bytes to string before passing


    return data
