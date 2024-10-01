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
    input_prompt =  sys.argv[1]
    file_path =     sys.argv[2]
    extension =     sys.argv[3]
    clave_api =     sys.argv[4]
    # Hacemos un switch de la extension del fichero para devolver un flujo generalizado
    if (extension == 'csv'):
        file = pd.read_csv(file_path)
    elif(extension == 'xls'):
        file = pd.read_excel(file_path)
    elif(extension == 'json'): 
        file = pd.read_json(file_path)
    # Creamos el modelo --> vamos a usar el LLM de PandasAI
    llm = BambooLLM(api_key=clave_api)
    df = SmartDataFrame(file, config={"llm":llm})
    # Creamos la respuesta
    response = df.chat(input_prompt)
    ultimo_codigo = df.last_code_executed
    # Devolvemos ambos valores
    return {"prompt_output": response, "last_code_executed": ultimo_codigo}
if __name__ == "__main__": # Ejecutamos al invocar
    resultado = main()
    # Imprimimos en JSON para que el TS lo lea
    import json
    print(json.dumps(resultado))