from flask import Flask, request, jsonify
import cv2
import numpy as np
from sklearn.cluster import KMeans
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for React

def apply_auto_preprocessing(image):
    """
    Optional pre-processing function to lightly enhance colors.
    """
    # 1. Small Gaussian blur
    blurred = cv2.GaussianBlur(image, (3, 3), 0)

    # 2. Convert to HSV and increase saturation by ~20%
    hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    s = np.clip(s * 1.2, 0, 255).astype(np.uint8)
    hsv_boosted = cv2.merge([h, s, v])
    saturated = cv2.cvtColor(hsv_boosted, cv2.COLOR_HSV2BGR)

    # 3. Small contrast boost
    contrast_img = saturated.astype(np.int16)
    contrast_factor = 10  # mild factor in [-100..100]
    contrast_img = contrast_img * (contrast_factor / 127 + 1) - contrast_factor
    contrast_img = np.clip(contrast_img, 0, 255).astype(np.uint8)

    return contrast_img

def extract_palette_info(image, n_colors=5):
    """
    Runs K-means to find n_colors dominant colors and computes:
    - HEX color
    - Percentage of each color
    - Average (x,y) location in normalized coords [0..1]
    """
    height, width, _ = image.shape

    # Convert BGR -> RGB
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # Flatten: (height*width, 3)
    img_flat = img_rgb.reshape((-1, 3))

    kmeans = KMeans(n_clusters=n_colors, random_state=42)
    kmeans.fit(img_flat)

    centers = kmeans.cluster_centers_.astype(int)  # shape (n_colors, 3)
    labels = kmeans.labels_  # which cluster each pixel belongs to

    unique, counts = np.unique(labels, return_counts=True)
    total_pixels = len(labels)

    clusters_info = []
    for cluster_idx in range(n_colors):
        # (R,G,B) from centers
        (r, g, b) = centers[cluster_idx]
        color_hex = f'#{r:02x}{g:02x}{b:02x}'

        # Count pixels in this cluster
        pixel_count = counts[cluster_idx] if cluster_idx in unique else 0
        percentage = (pixel_count / total_pixels) * 100

        # Find average x,y for cluster
        cluster_pixels = np.where(labels == cluster_idx)[0]  # 1D indices
        if len(cluster_pixels) > 0:
            y_coords = cluster_pixels // width
            x_coords = cluster_pixels % width
            avg_y = np.mean(y_coords)
            avg_x = np.mean(x_coords)
            # Normalize to [0..1]
            avg_y_norm = avg_y / float(height)
            avg_x_norm = avg_x / float(width)
        else:
            avg_x_norm, avg_y_norm = 0.5, 0.5  # fallback if no pixels

        clusters_info.append({
            'hex': color_hex,
            'percentage': percentage,
            'avg_x': avg_x_norm,
            'avg_y': avg_y_norm,
        })

    return clusters_info

@app.route('/extract_palette', methods=['POST'])
def extract_palette_route():
    """
    Main endpoint that:
    - Receives an image
    - Optionally does light preprocessing
    - Extracts dominant colors with their percentages and avg positions
    - Returns JSON with clusters info
    """
    file = request.files['image']
    n_colors = int(request.form.get('n_colors', 5))

    # Decode image
    file_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Auto preprocessing (optional)
    image = apply_auto_preprocessing(image)

    # Get color info
    clusters_info = extract_palette_info(image, n_colors)

    # Return array of objects
    return jsonify({'clusters': clusters_info})

if __name__ == '__main__':
    app.run(debug=True, port=5000)