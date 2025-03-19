# **Proyecto Palette:**

## Descripción
Palette es una aplicación que **analiza una imagen y calcula el porcentaje de cada color** que se encuentra presente en ella

## Características
- Procesa imágenes y extrae la distribución de colores
- Muestra los colores predominantes con su porcentaje
- Genera una paleta visual con los colores detectados




## Tecnologías utilizadas
### Front End:
- <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/react.png" alt="react" width="30" height="30" align="center" /> React
- <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/tailwind_css.png" alt="react" width="30" height="30" align="center" /> Tailwind CSS

Proporciona la interfaz de usuario para subir imágenes y mostrar los colores dominantes en la imágen, enviandola a el backend para ser analizada

## Backend:
- <img src="https://github.com/user-attachments/assets/934b9e08-b664-4d3f-81b2-8f8dca675019" alt="react" width="30" height="30" align="center" /> Flask
- <img src="https://github.com/user-attachments/assets/2971dd06-a10b-46ee-851f-ac9edf4dc9f2" alt="react" width="30" height="30" align="center" /> OpenCVcomputadora
- <img src="https://github.com/user-attachments/assets/a6828e6e-5600-4e5f-8f52-9db69e4e951b" alt="react" width="30" height="30" align="center" /> Scikit-learn

  

Define un endpoint principal que recibe la imágen y extrae los clusters de colores

## Flujo de la app:
1. El usuario sube una imagen a la aplicación
2. Flask recibe la imagen y la envía al backend
3. OpenCV permite que se procese la imagen y extrae sus colores en formato númerico
4.Con la libreria de scikit-lear se agrupan los colores similares para después poder realizar el calculo del porcentaje de cada uno
5. La librería de numpy es utilizada para realizar cálculos matemáticos sobre los pixeles de la imagen, además de permitir manejar matrices de datos para analizar la distribución de colores
6. Flask devuelve los datos al usuario en un formato visual


