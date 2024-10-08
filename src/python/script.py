# Imports Principales
import pandas as pd
import numpy as np
import os
import sys
# Imports de PandasAI
import pandasai
from pandasai import SmartDataFrame
from pandasai.llm import BambooLLM

def main():
    # Recibimos los argumentos
    file_path = sys.argv[1]
    nombre = sys.argv[2]
    consulta = sys.argv[3]
    extension = sys.argv[4]
    claveAPI = sys.argv[5]
    print('python: Argumentos recibidos')
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
    llm = BambooLLM(api_key=claveAPI)
    df = SmartDataFrame(file, name=nombre, config={"llm":llm})
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
    print('python: Comienza el fichero')
    resultado = main()
    print('python: Resultados obtenidos')
    # Imprimimos en JSON para que el TS lo lea
    import json
    print(json.dumps(resultado))