# Imports Principales
import pandas as pd
import numpy as np
import sys
import logging
import os
# Imports de PandasAI
import pandasai
from pandasai import SmartDataframe
# Hacemos que los log se muesten por consola
log_file = os.path.expanduser("~/pandasai.log")
logging.basicConfig(filename=log_file, level=logging.INFO)
# Definimos el principal funcionamiento de la extensión
def main():
    # Recibimos los argumentos
    file_path = sys.argv[1]
    nombre = sys.argv[2]
    consulta = sys.argv[3]
    extension = sys.argv[4]
    claveAPI = sys.argv[5]
    print('python: Argumentos recibidos')
    os.environ["PANDASAI_API_KEY"] = claveAPI
    # Leemos el fichero para dejar un flujo uniforme
    try:
        print('python: Leyendo fichero... ')
        if extension == 'xls' or extension == 'xlsx':
            file = pd.read_excel(file_path)
        elif extension == 'csv':
            file = pd.read_csv(file_path)
        elif extension == 'json':
            file = pd.read_json(file_path)
        else:
            raise ValueError(f'python: Error formato incorrecto: {extension}')
        
    except Exception as e:
        return({ "error": f"Error al leer el archivo {e}" })
    
    print('python: Fichero leído')
    
    # Creamos el modelo --> vamos a usar el LLM de PandasAI
    df = SmartDataframe(file, name=nombre)
    print('python: Creados modelo y SmartDataFrame')
    # Creamos la respuesta
    try:
        print('python: Comenzamos la consulta')
        response = df.chat(consulta)
        ultimo_codigo = df.last_code_executed
        print('python: Acaba la consulta')
        
    except Exception as e:
        return {"error": f"Error en la consulta: {e}"}
    
    # Devolvemos ambos valores
    return {"prompt_output": response, "last_code_executed": ultimo_codigo}

if __name__ == "__main__": # Ejecutamos al invocar
    resultado = main()
    # Imprimimos en JSON para que el TS lo lea
    import json
    print(json.dumps(resultado))