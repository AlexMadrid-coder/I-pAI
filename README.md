# I-pAI - Chatbot Inteligente con PandasAI

## Descripción

**I-pAI** es una extensión de VS Code diseñada para ser una herramienta de análisis y procesamiento de datos usando Python, Pandas y PandasAI. Esta extensión permite cargar archivos de diversos formatos (Excel, CSV, JSON), realizar consultas sobre los datos a través de un script en Python y generar respuestas utilizando PandasAI. El objetivo principal de este proyecto es optimizar la interacción con grandes volúmenes de datos históricos o en tiempo real, facilitando su análisis mediante inteligencia artificial.

## Funcionalidades

- **Cargar archivos de datos**: El usuario puede cargar archivos de diversos formatos (Excel, CSV, JSON) desde la interfaz web de la extensión, que serán procesados en el backend con un script en Python.
- **Procesamiento de datos con Pandas**: El script en Python utiliza la biblioteca Pandas para gestionar y procesar los datos proporcionados.
- **Integración con PandasAI**: El motor PandasAI permite generar respuestas automatizadas basadas en las consultas proporcionadas por el usuario sobre los datos cargados.
- **Compatibilidad multiplataforma**: El proyecto es compatible tanto en Windows como en Linux gracias a la gestión de entornos virtuales separados para cada sistema operativo.
- **Respuestas automáticas**: Se genera una respuesta a las consultas del usuario basada en los datos, así como el código utilizado por PandasAI para que el usuario pueda inspeccionar el proceso de creación de la respuesta.

## Requisitos del sistema

- **Python 3.10.x** o superior.
- **VS Code** con soporte para extensiones.
- **Node.js y npm** (para el desarrollo y manejo de dependencias en la extensión).
- **Entornos virtuales** para cada sistema operativo compatible (Linux y Windows).
- **Librerías de Python**:
  - Pandas
  - PandasAI
  - Openpyxl (para archivos Excel)
  - json y csv (para formatos JSON y CSV)
  
### Dependencias

En el entorno de desarrollo se utilizan las siguientes herramientas:

- **Backend (Python)**:
  - Pandas
  - PandasAI
  - Openpyxl
  - json y csv (manejo de archivos)
  
- **Frontend (JS y TypeScript)**:
  - Módulo `child_process` para la ejecución de scripts Python.
  - Comunicación con el backend mediante mensajes entre JavaScript y TypeScript.

## Instalación

### 1. Clonar el repositorio

Primero, clona este repositorio en tu máquina local:

```bash
git clone https://github.com/tu-usuario/I-pAI.git
cd I-pAI
```

### 2. Configurar los entornos virtuales para Python

Este proyecto utiliza entornos virtuales separados para Windows y Linux. Sigue las instrucciones para cada sistema operativo.

#### En Linux/macOS

1. Instala `pyenv` y `pyenv-virtualenv` si aún no lo tienes:
   ```bash
   curl https://pyenv.run | bash
   ```
2. Crea el entorno virtual para Linux:
   ```bash
   pyenv virtualenv 3.10.x i-pai-linux
   pyenv activate i-pai-linux
   ```
3. Instala las dependencias de Python:
   ```bash
   pip install -r requirements.txt
   ```

#### En Windows

1. Instala `pyenv-win` y crea un entorno virtual:
   ```bash
   pyenv install 3.10.x
   pyenv virtualenv 3.10.x i-pai-windows
   pyenv activate i-pai-windows
   ```
2. Instala las dependencias de Python:
   ```bash
   pip install -r requirements.txt
   ```

### 3. Configuración de VS Code

1. Abre el proyecto en VS Code:
   ```bash
   code .
   ```

2. Instala las dependencias de Node.js para el desarrollo de la extensión:
   ```bash
   npm install
   ```

3. Compila el proyecto TypeScript para que la extensión funcione correctamente:
   ```bash
   npm run compile
   ```

### 4. Ejecución del proyecto

Para iniciar la extensión de VS Code y el servidor de Python:

1. Ejecuta VS Code en modo de desarrollo con tu extensión:
   ```bash
   F5
   ```
2. La extensión abrirá una interfaz web donde puedes cargar un archivo y realizar una consulta.
3. El archivo será enviado al backend y procesado por el script de Python, devolviendo tanto la respuesta a la consulta como el código generado por PandasAI.

## Uso

1. **Cargar un archivo de datos**: Selecciona un archivo de tipo Excel, CSV o JSON desde la interfaz web.
2. **Realizar una consulta**: Escribe una consulta sobre los datos que quieras procesar.
3. **Ver la respuesta**: La extensión ejecutará un script de Python con Pandas y PandasAI y te devolverá una respuesta basada en la consulta, así como el código generado por PandasAI.
4. **Inspeccionar el código**: Revisa el código que se ha generado y usado para la respuesta.

## Multiplataforma

Este proyecto ha sido diseñado para funcionar tanto en **Windows** como en **Linux**, utilizando entornos virtuales separados para cada plataforma.

- En **Linux**, los entornos virtuales se almacenan en `~/pyenv/versions/`.
- En **Windows**, los entornos virtuales se encuentran en la ruta configurada por `pyenv-win`.

La extensión detecta automáticamente el sistema operativo y activa el entorno correspondiente antes de ejecutar el proceso de Python.

## Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras algún error o tienes una sugerencia, siéntete libre de crear un **Issue** o un **Pull Request**.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

Este documento proporciona una guía clara para que los usuarios instalen, configuren y usen tu proyecto. Si tienes más detalles específicos o necesitas ajustar algo más, estaré encantado de ayudarte a personalizarlo.
