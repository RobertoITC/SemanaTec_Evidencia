# **Proyecto Palette:**

## Descripción
Palette es una aplicación que analiza una imagen y calcula el porcentaje de cada color que se encuentra presente en ella

## Características
- Procesa imágenes y extrae la distribución de colores
- Muestra los colores predominantes con su porcentaje
- Genera una paleta visual con los colores detectados

## Tecnologías utilizadas
### Front End:
- React
- Tailwind CSS 

## Backend:
- Flask
- OpenCVcomputadora
- Scikit-learn

## Flujo de la app:
1. El usuario sube una imagen a la aplicación
2. Flask recibe la imagen y la envía al backend
3. OpenCV permite que se procese la imagen y extrae sus colores en formato númerico
4.Con la libreria de scikit-lear se agrupan los colores similares para después poder realizar el calculo del porcentaje de cada uno
5. La librería de numpy es utilizada para realizar cálculos matemáticos sobre los pixeles de la imagen, además de permitir manejar matrices de datos para analizar la distribución de colores
6. Flask devuelve los datos al usuario en un formato visual


