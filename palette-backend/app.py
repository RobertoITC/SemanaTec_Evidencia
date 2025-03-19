from flask import Flask, request, jsonify
import cv2
import numpy as np
from sklearn.cluster import KMeans
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from React dev server

def adjust_brightness_contrast(image, brightness=0, contrast=0):
    # brightness: -100 to 100
    # contrast: -100 to 100
    buf = image.astype(np.int16)
    buf = buf * (contrast / 127 + 1) - contrast + brightness
    buf = np.clip(buf, 0, 255).astype(np.uint8)
    return buf

def extract_palette(image, n_colors=5):
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    img_flat = img_rgb.reshape((-1, 3))

    kmeans = KMeans(n_clusters=n_colors, random_state=42)
    kmeans.fit(img_flat)

    colors = kmeans.cluster_centers_.astype(int)
    palette = [tuple(color) for color in colors]
    return palette

@app.route('/extract_palette', methods=['POST'])
def extract_palette_route():
    # Parse request data
    file = request.files['image']
    n_colors = int(request.form.get('n_colors', 5))
    brightness = int(request.form.get('brightness', 0))
    contrast = int(request.form.get('contrast', 0))
    grayscale = request.form.get('grayscale', 'false') == 'true'

    # Read image bytes
    file_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Apply brightness & contrast
    image = adjust_brightness_contrast(image, brightness, contrast)

    # Optional grayscale
    if grayscale:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)

    # Extract palette
    palette_rgb = extract_palette(image, n_colors)

    # Convert (R,G,B) to hex
    palette_hex = ['#%02x%02x%02x' % (r, g, b) for (r, g, b) in palette_rgb]

    return jsonify({'palette': palette_hex})

if __name__ == '__main__':
    app.run(debug=True, port=5000)