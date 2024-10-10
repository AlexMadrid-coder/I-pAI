def main():
    print('python: Estamos dentro')
    
if __name__ == "__main__":
    main()
    import json
    print(json.dumps(
        {
            "prompt_output": "hola",
            "las_code_executed": "bombardeen metrovalencia"
        }))