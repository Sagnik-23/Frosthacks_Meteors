from flask import Flask, request, jsonify
from PIL import Image
import os
from extrect_text import *  # Import function to extract text from image
from get_medicine_links import *  # Import function to get medicine links
from data_base import *  # Import function to interact with database
import uuid
from get_locations import *
from get_medicine_details import *
from flask_cors import CORS
from chatbort import *
from send_sms import *
from get_medicine_details import *
from search_med_generic_name import *
from geminy_helper import *


app = Flask(__name__)

CORS(app)

# Directory where images will be saved
SAVE_DIR = "output"

# Create the directory if it doesn't exist
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

# database initilize

Session = initialize_db()
session = Session()

# get medicine name from image
@app.route('/')
def index():
    return "Hello, World!"

@app.route('/get_medicine_names', methods=['POST', 'GET'])
def main():
    """
    Handles image upload, saves the image, and extracts text using Azure Document AI.
    Returns the extracted text along with the saved image path.
    """
    print("✅ main.py calling successfully ")

    # Ensure that the request method is POST
    if request.method == 'GET':
        return jsonify({'message': 'radhe radhe'}), 200

    if request.method == "POST":
        # Check if the request contains an image file
        if "image" not in request.files:
            return jsonify({"error": "No image file uploaded"}), 400

        img = request.files["image"]

        if img:
            # Open the uploaded image
            image = Image.open(img)

            # Save the uploaded image in the output directory
            image_filename = os.path.join(SAVE_DIR, "uploaded_image.png")
            print(image_filename)
            image.save(image_filename)

            # Reset the file pointer to read image bytes
            # img.seek(0)
            # file_bytes = img.read()
            # reade ingae
            with open(image_filename, "rb") as image_file:
                file_bytes = image_file.read()

            # Extract text from the image
            data = extrect_text(file_bytes)
            print("✅ extrected text found")

            # print(data)
            try:

                for i in data["medicines"]:
                    # print(i)

                    i["websites"] = []
            except:
                data["medicines"] = []

            if "num" in request.form:
                num = request.form["num"]
                print("✅ Number found")
                # Prompt for AI processing
                prompt = f"extrect the time imformation from the following json data when we have to use this meditnine time when wehen we have to use this medicine ex: 8:00 am 12:00 pm 9:00 pm if any person day start ai 8:00 so say wich time we have to take meditine and you ect best of the give data json outout no additional value:\n{data}"
                num = str(num)
                # Get AI response
                msg = AI_FILTER(prompt)
                print("✅ AI response found")
                msg = str(msg)
                # msg="radhe radhe"
                sendMsg(msg=msg, to_num=num)
                print(f"✅ sms successfully sent in {num}")

            if "token" in request.form:
                jwt_token = request.form["token"]
                if jwt_token != "":
                    trans_id = str(uuid.uuid4())
                    print("✅ Token found")
                    store_data(session=session, transaction_id=trans_id,
                            jwt_token=jwt_token, site_content=data, image_path=image_filename)
                    print("✅ data successfully stored in database")

            return jsonify({
                "data": data
            }), 200

        else:
            return jsonify({"error": "No image found in the request"}), 400


# get medicine links
@app.route('/get_medicine_links', methods=['POST'])
def get_medicine_links():
    """
    Accepts a text input (medicine name) and retrieves relevant medicine links.
    Returns the list of medicines with links.
    """
    # Check if the request contains a text field
    if "text" not in request.form:
        return jsonify({"error": "No text data provided"}), 400

    med = request.form['text']

    # Fetch medicine links based on the provided text
    medicines = get_medicine_name_links(med=med)

    return jsonify({
        "medicines": medicines
    }), 200


# get history
@app.route('/history', methods=['POST'])
def get_history():
    if "token" in request.form:
        jwt_token = request.form["token"]
        history = get_all_history(session=session, jwt_token=jwt_token)
        # save in file
        with open('output/history.json', 'w') as f:
            json.dump(history, f)

        return jsonify({"history": history}), 200


# get meditine detail uses and side effect
@app.route('/get_medicine_detail', methods=['POST'])
def get_meditine_details():
    if "name" in request.form:
        med_name = str(request.form["name"])
        med_details = get_medicine_details_fun(medicine_name=med_name)
        print(med_details)
        return jsonify({"detail": med_details}), 200


# get location
@app.route('/get_location', methods=['POST'])
def get_location():
    if ("latitude" in request.form) and ("longitude" in request.form):
        late = request.form["latitude"]
        long = request.form["longitude"]

        location = get_positions(latitute=late, logitute=long)
        return jsonify({"location": location}), 200
    else:
        return jsonify({"error": "No location data provided"}), 400


# send msg
@app.route('/send_msg', methods=["POST"])
def send_msg():
    # print(request.form)
    if"num" in request.form:
        # num = str(request.form["num"])
        # print("✅ Number found")
        # # Prompt for AI processing
        # prompt = f"extrect the time imformation from the following json data when we have to use this meditnine time when wehen we have to use this medicine ex: 8:00 am 12:00 pm 9:00 pm if any person day start ai 8:00 so say wich time we have to take meditine and you ect best of the give data json outout no additional value:\n{data}"
        # num = str(num)
        # # Get AI response
        # msg = AI_FILTER(prompt)
        # print("✅ AI response found")
        # msg = str(msg)
        # # msg="radhe radhe"
        # sendMsg(msg=msg, to_num=num)
        # print(f"✅ sms successfully sent in {num}")
        # send msg to user
        return jsonify({"response": "msg send succesfully"}), 200
    else:
        return jsonify({"error": "No msg data provided"}), 400


@app.route('/generic_name_search', methods=['POST'])
def generic_name_search():

    try:
        if "name" in request.form:
            name = str(request.form["name"])
            # Call function to search for generic name
            results = get_medicine_data(medicine_name=name)
            return jsonify({"results": results}), 200
        else:
            return jsonify({"error": "No name data provided"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/ai_chat', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def ai_chat():
    # return "radhe radhe"
    try:
        data = request.form  # Use JSON input instead of form data
        print(data)
        if not data or "text" not in data:
            return jsonify({"error": "No text data provided"}), 400

        user_text = data["text"]
        print(user_text)

        # Load medicine_name.json as a string
        with open('output/medicine_name.json', 'r') as f:
            med_name = f.read()  # Read as plain text

        # Call AI response function
        response = ai_response(medical_data=med_name, query=user_text)

        return jsonify({"response": response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Run the Flask app in debug mode
    app.run(host="0.0.0.0", port=8000)

