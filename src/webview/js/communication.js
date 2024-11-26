// Importamos las funciones necesarias
import { addMessage } from './main.js';
import { mostrarError } from './main.js';
import { mostrarResultados } from './main.js';
import { cambiarIdioma } from './languaje.js';
import { cambiarTema } from './tema.js';

// Declaramos las variables globales necesarias
const vscode = acquireVsCodeApi(); // Con esto creamos el flujo vscode-webview
//----------------------------------------------------------------------------//
/**
 * TRIGGER --> DOMContentLoaded
 * 
 * Disparador para sacar de la memoria de la extensión la clave usada por si queremos cambiarla
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * TRIGGEr --> guardarBtn
     * 
     * Guardamos en la memoria de la extensión la clave API que vamos a utilizar
     */
    document.getElementById('guardarBtn').addEventListener('click', () => {
        const clave = document.getElementById('claveInput').value;
        vscode.postMessage({command: 'guardarClave', clave: clave});
    });
    /**
     * TRIGGER --> selectorTema
     * 
     * Guardamos en la memoria de la extensión el tema que queremos utilizar
     */
    document.getElementById('selectorTema').addEventListener('change',  () => {
        vscode.postMessage({command: 'ipai-cambiarTema', clave: 'changed'});
        cambiarTema();
    });
    /**
     * TRIGGER --> cambiarIdioma
     * 
     * Guardamos en memoria de la extensión el idioma que queremos utilizar
     */
    document.getElementById('selectorLenguaje').addEventListener('change', () => {
        const clave = document.getElementById('selectorLenguaje').value;
        vscode.postMessage({command: 'ipai-cambiarLenguaje', clave: clave});
        cambiarIdioma(clave);
    });
    // Mandamos al TS que queremos la clave
    vscode.postMessage({command: 'obtenerClave'});
    // Mandasmos al TS que queremos el tema guardado
    vscode.postMessage({command: 'ipai-getTema'});
    // Mandamos al TS que queremos el lenguaje guardado
    vscode.postMessage({command: 'ipai-getLenguaje'});
    /**
     * TRIGGER --> message
     * 
     * Después de solicitar la clave esperamos y recogemos el mensaje
     * 
     *      command --> Mensaje que recibimos del TS
     *      clave   --> Contenido, clave API, valor del tema a utilizar y idioma a utilizar
     */
    window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'claveAPI' && message.clave) {
            document.getElementById('claveInput').value = message.clave;
        }
        else if (message.command === 'ipai-Tema' && message.clave) {
            // Aquí cambiamos el tema que ya teníamos guardado si lo habíamos cambiado previemente
            if (message.clave === 'changed') {
                cambiarTema();
                document.getElementById('selectorTema').checked = true;
            }
        }
        else if (message.command === 'ipai-Lenguaje' && message.clave) {
            // Aquí recibimos el lenguaje seleccionado y cambiamos todo lo hecho
            cambiarIdioma(message.clave);
        }
    });
});
//----------------------------------------------------------------------------//
/**
 * Este listener es para recibir los mensajes después de 
 */
window.addEventListener('message', event => {
    const message = event.data;
    // Verificamos que hemos recibido el mensaje correcto o error
    if (message.command === 'ipai-resultado') {
        // Simplemente llamo a esta función 
        mostrarResultados(message.outputPrompt, message.lastExecutedCode);
    }
    else if (message.command === 'ipai-error') {
        /**
         * En este apartado tenemos 3 tipos de error que pueden suceder
         * 1. Si no se llega a ejecutar el entorno Python
         *      No hacemos nada y recogemos todo por consola
         * 2. Error al parsear la respuesta de Python 
         *      Mostramos un mensaje en el webview
         * 3. El proceso de Python finalizó con código erroneo
         *      Mostramos un mensaje en el webview
         */
        mostrarError(message.errorMessage);
    }
});
//----------------------------------------------------------------------------//
/**
 * FUNCTION comunicacion()
 * 
 * Función que se encarga de la comunicación efectiva y gestión de excepciones entre JS-TS
 * 
 * Excpciones que manejamos:
 *      1. No subimos consulta
 *      2. No subimos fichero
 *      3. Subimos un fichero con un formato incorrecto
 */
function comunicacion() {
    // Lo primero que vamos a sacar es si hemos subido o no fichero
    const fichero = document.getElementById('upload-btn').files[0];
    const permitidas = ['xls', 'xlsx', 'csv', 'json'];
    const extension = fichero.name.split(".").pop().toLowerCase();
    const nombre = fichero.name;
    const directorio = fichero.path;
    // También tenemos que sacar el texto para la consulta
    const consulta = document.getElementById('div-prompt').innerText.trim();
    // Realizamos las comprobaciones
    if (consulta === "") { // Si no tenemos consulta
        vscode.postMessage({command: "error-NoConsulta"});
        return;
    }
    if (!fichero) { // Si no hemos subido fichero
        vscode.postMessage({command: "error-NoFichero"});
        return;
    }
    if (!permitidas.includes(extension)) { // Si el formato del fichero es incorrecto
        vscode.postMessage({command: "error-FormatoIncorrecto", error: extension});
        return;
    }
    // Una vez preparado creamos el mensaje y lo mandamos
    const mensaje = { /**
                * Estructura que vamos a pasar al TS
                * Le vamos a pasar:
                *   1. El comando para ejecutar la consulta
                *   2. El nombre del fichero para dar soporte a PandasAI 
                *   3. El directorio en el que tenemos el fichero para ahorrar problemas
                *   4. La extensión para poder procesarlo en Python
                *   5. La consulta a ejercer sobre el Dataset
                */
        command: 'ipai-consulta',
        nombre: nombre,
        directorio: directorio,
        extension: extension,
        consulta: consulta
    };
    vscode.postMessage(mensaje);
}
//----------------------------------------------------------------------------//
/**
 * TRIGGER --> send-btn
 * 
 * Activamos la comunicación al hacer click sobre el botón de enviar
 * Primero que nada añadimos el div con el prompt de consulta y luego le pasamos todo el material a la extensión para que la procese
 */
document.getElementById('send-btn').addEventListener('click', function(){
    addMessage();
    comunicacion();
    
});
//----------------------------------------------------------------------------//
/**
 * TRIGGER --> chat-input
 * 
 * Hacemos exactamente lo mismo que el anterior pero utilizando el enter sobre el textarea para el input prompt.
 */
document.getElementById('chat-input').addEventListener('keydown', function(event){
    if (event.key === 'Enter') {
        event.preventDefault();
        addMessage();
        comunicacion();
    }
});