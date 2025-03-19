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

1. **Subida de la Imagen**  
   El usuario selecciona o arrastra una imagen al formulario de React.  

2. **Envío al Backend**  
   El frontend llama a un endpoint del servidor Flask (por ejemplo, `POST /process-image`) y adjunta la imagen.

3. **Procesamiento en Flask**  
   - **Lectura con OpenCV**:  
     Convierte la imagen en un arreglo de píxeles y obtiene su representación en canales de color.  
   - **Agrupamiento con Scikit-learn**:  
     Se ejecuta un algoritmo (generalmente K-means) para clasificar los píxeles en grupos de color predominantes.  
   - **Cálculos con NumPy**:  
     Se cuantifica la proporción de cada clúster dividiendo la cuenta de píxeles de dicho clúster entre el total de píxeles.  

4. **Respuesta al Frontend**  
   Flask envía la data procesada en formato JSON, incluyendo:  
   - El color dominante en formato RGB/HEX.  
   - El porcentaje relativo de cada color detectado.  

5. **Visualización de Resultados**  
   El frontend recibe la respuesta y la muestra al usuario en un **panel de colores** con la proporción y/o en formato gráfico (barras, anillos, etc.).
---

## Local deployment
### Frontend

```
cd palette-frontend
npm install
npm run dev
```
Frontend web app normalmente se corre en el purto http://localhost:5173
### Backend
```
cd palette-backend
pip install -r requirements.txt
python app.py
```
Backend server normalmente se corre en el purto http://localhost:5000

---
Hecho por: 
- Hannia Peña 
- Roberto Morales





