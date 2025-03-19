from flask import Flask, request, jsonify
import cv2
import numpy as np
from sklearn.cluster import KMeans
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS para permitir peticiones desde el frontend de React

def apply_auto_preprocessing(image):
    """
    Aplica un preprocesamiento ligero para resaltar
    mejor los colores y ayudar a agruparlos.
    - Pequeño desenfoque Gaussiano
    - Aumento de saturación
    - Contraste ligero (opcional)
    """

    # 1. Pequeño desenfoque Gaussiano
    blurred = cv2.GaussianBlur(image, (3, 3), 0)

    # 2. Aumento de saturación (convertimos de BGR a HSV)
    hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)

    # Incrementamos saturación al ~120%
    s = np.clip(s * 1.2, 0, 255).astype(np.uint8)

    hsv_boosted = cv2.merge([h, s, v])
    saturated = cv2.cvtColor(hsv_boosted, cv2.COLOR_HSV2BGR)

    # 3. Ajuste leve de contraste (si se desea, aquí es muy básico)
    # Convertimos a float para manipular
    contrast_img = saturated.astype(np.int16)
    # Un factor bajo de contraste, p. ej. 10 en el rango [-100..100]
    contrast_factor = 10
    contrast_img = contrast_img * (contrast_factor / 127 + 1) - contrast_factor
    contrast_img = np.clip(contrast_img, 0, 255).astype(np.uint8)

    return contrast_img

def extract_palette(image, n_colors=5):
    """
    Aplica K-means para extraer n_colors colores dominantes en la imagen.
    Devuelve una lista de tuplas (R,G,B).
    """
    # Convertir de BGR a RGB (convención habitual de procesamiento)
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Aplanar la imagen a un arreglo de forma (total_pixeles, 3)
    img_flat = img_rgb.reshape((-1, 3))

    kmeans = KMeans(n_clusters=n_colors, random_state=42)
    kmeans.fit(img_flat)

    # Centroides, que representan los colores dominantes
    colors = kmeans.cluster_centers_.astype(int)
    palette = [tuple(color) for color in colors]
    return palette

@app.route('/extract_palette', methods=['POST'])
def extract_palette_route():
    """
    Endpoint principal que recibe una imagen y el número de colores (n_colors).
    Aplica un preprocesamiento ligero y extrae la paleta de colores dominantes.
    Devuelve un JSON con los colores en formato hexadecimal.
    """
    # Recibe el archivo de la imagen y el número de colores a extraer
    file = request.files['image']
    n_colors = int(request.form.get('n_colors', 5))

    # Leer la imagen en memoria y decodificar con OpenCV
    file_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Preprocesamiento automático (blur + saturación + pequeño contraste)
    image = apply_auto_preprocessing(image)

    # Extraer paleta de colores
    palette_rgb = extract_palette(image, n_colors)

    # Convertir cada (R,G,B) a formato HEX
    palette_hex = [f'#{r:02x}{g:02x}{b:02x}' for (r, g, b) in palette_rgb]

    return jsonify({'palette': palette_hex})

if __name__ == '__main__':
    app.run(debug=True, port=5000)