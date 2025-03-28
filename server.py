from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import os
import requests
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Replace with your actual Google API key
GOOGLE_API_KEY = "AIzaSyClgnoUG4uCqPHgQ4IZYpqw8T_57uu-rHw"

def get_location_details(lat, lng):
    # Make a request to the Google Geocoding API
    geo_api_url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={GOOGLE_API_KEY}"
    response = requests.get(geo_api_url)

    # Check for errors in the geocoding API response
    if response.status_code != 200:
        raise Exception(f"Error from Google Geocoding API: {response.text}")

    # Parse the JSON response
    result = response.json()
    if not result.get("results"):
        return "Unknown location"

    # Extract the city from the address components
    address_components = result["results"][0]["address_components"]
    city = None
    for component in address_components:
        if "locality" in component["types"]:
            city = component["long_name"]
            break

    return city or "Unknown location"

def identify_image_location(image_path):
    # Open and read the image file, encoding it in base64
    with open(image_path, "rb") as image_file:
        image_data = base64.b64encode(image_file.read()).decode("utf-8")

    # Send the image data to the Google Vision API
    api_url = f"https://vision.googleapis.com/v1/images:annotate?key={GOOGLE_API_KEY}"
    headers = {"Content-Type": "application/json"}
    request_body = {
        "requests": [
            {
                "image": {"content": image_data},
                "features": [{"type": "LANDMARK_DETECTION"}]
            }
        ]
    }

    # Make the POST request to the Vision API
    response = requests.post(api_url, headers=headers, json=request_body)

    if response.status_code != 200:
        raise Exception(f"Error from Google Vision API: {response.text}")

    # Parse the response to get landmarks
    result = response.json()
    landmarks = result.get("responses", [{}])[0].get("landmarkAnnotations", [])

    if landmarks:
        landmark = landmarks[0]
        lat, lng = landmark["locations"][0]["latLng"].values()
        # Get the city based on the detected landmark's coordinates
        city = get_location_details(lat, lng)
        return city
    else:
        return "Location not identified."

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded file to a temporary location
    temp_file_path = os.path.join('uploads', file.filename)
    os.makedirs('uploads', exist_ok=True)
    file.save(temp_file_path)

    try:
        city = identify_image_location(temp_file_path)
        return jsonify({"city": city})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    app.run(debug=True, port=5000)