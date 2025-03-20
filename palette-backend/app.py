from flask import Flask, request, jsonify
import cv2
import numpy as np
from sklearn.cluster import KMeans
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite peticiones desde el frontend


def apply_auto_preprocessing(image):
    """
    Mejora ligera de la imagen:
      1. Desenfoque Gaussiano leve
      2. Aumento de saturación ~20%
      3. Pequeño boost de contraste
    """
    # 1. Pequeño desenfoque Gaussiano para suavizar ruido
    blurred = cv2.GaussianBlur(image, (3, 3), 0)

    # 2. Aumentar saturación en el espacio HSV
    hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    s = np.clip(s * 1.2, 0, 255).astype(np.uint8)
    hsv_boosted = cv2.merge([h, s, v])
    saturated = cv2.cvtColor(hsv_boosted, cv2.COLOR_HSV2BGR)

    # 3. Pequeño ajuste de contraste
    contrast_img = saturated.astype(np.int16)
    contrast_factor = 10  # valor leve en [-100..100]
    contrast_img = contrast_img * (contrast_factor / 127 + 1) - contrast_factor
    contrast_img = np.clip(contrast_img, 0, 255).astype(np.uint8)

    return contrast_img


def extract_palette_info(image, n_colors=5):
    """
    Ejecuta K-means con n_colors clusters y devuelve una lista de:
      {
        'hex': "#rrggbb",
        'percentage': ...,
        'avg_x': ...,
        'avg_y': ...
      }
    donde (avg_x, avg_y) son coordenadas promedio normalizadas [0..1].
    """
    height, width, _ = image.shape

    # Convertir de BGR a RGB (OpenCV usa BGR por defecto)
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Aplanar la imagen a (num_pixeles, 3)
    img_flat = img_rgb.reshape((-1, 3))

    # K-means++ para inicialización más estable, con varias corridas
    kmeans = KMeans(
        n_clusters=n_colors,
        init='k-means++',
        n_init=10,
        random_state=42
    )
    kmeans.fit(img_flat)

    centers = kmeans.cluster_centers_.astype(int)   # (n_colors, 3)
    labels = kmeans.labels_  # cluster asignado a cada píxel

    unique, counts = np.unique(labels, return_counts=True)
    total_pixels = len(labels)

    clusters_info = []
    for cluster_idx in range(n_colors):
        # Obtén (R, G, B) del centro de este cluster
        (r, g, b) = centers[cluster_idx]
        color_hex = f'#{r:02x}{g:02x}{b:02x}'

        # Cantidad de píxeles que pertenecen a este cluster
        # Si el cluster no existe en unique, asume 0
        if cluster_idx in unique:
            pixel_count = counts[unique.tolist().index(cluster_idx)]
        else:
            pixel_count = 0

        # Porcentaje en relación al total
        percentage = (pixel_count / total_pixels) * 100 if total_pixels > 0 else 0

        # Hallar los índices en 1D de los píxeles de este cluster
        cluster_pixels = np.where(labels == cluster_idx)[0]
        if len(cluster_pixels) > 0:
            # Convertir índice 1D a coordenadas (y, x)
            y_coords = cluster_pixels // width
            x_coords = cluster_pixels % width
            avg_y = np.mean(y_coords)
            avg_x = np.mean(x_coords)

            # Normalizar a [0..1]
            avg_y_norm = avg_y / float(height)
            avg_x_norm = avg_x / float(width)
        else:
            # Fallback en caso de cluster vacío
            avg_x_norm, avg_y_norm = 0.5, 0.5

        # Para evitar círculos irrelevantes, solo anexar clusters con píxeles (>0)
        if pixel_count > 0:
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
    Endpoint principal:
      1. Recibe la imagen via POST (multipart/form-data)
      2. Preprocesa la imagen (blur, saturación, contraste)
      3. Ejecuta K-means para extraer clusters de color
      4. Devuelve un JSON con info de cada color
    """
    file = request.files['image']
    n_colors = int(request.form.get('n_colors', 5))

    # Decodificar la imagen a arreglo OpenCV
    file_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Preprocesamiento (opcional)
    image = apply_auto_preprocessing(image)

    # Extraer colores dominantes
    clusters_info = extract_palette_info(image, n_colors)

    # Retornar resultado en formato JSON
    return jsonify({'clusters': clusters_info})


if __name__ == '__main__':
    # Arranca servidor en modo debug, puerto 5000
    app.run(debug=True, port=5000)