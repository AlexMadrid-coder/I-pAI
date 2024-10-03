// Importamos las funciones necesarias
import { addMessage } from './main.js';
import { mostrarError } from './main.js';
import { mostrarResultados } from './main.js';

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
    // Mandamos al TS que queremos la clave
    vscode.postMessage({command: 'obtenerClave'});
    /**
     * TRIGGER --> message
     * 
     * Después de solicitar la clave esperamos y recogemos el mensaje
     * 
     *      command --> Mensaje que recibimos del TS
     *      clave   --> Contenido, clave API
     */
    window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'claveAPI' && message.clave) {
            document.getElementById('claveInput').value = message.clave;
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
        // Simplemente llamamo a esta función 
        mostrarResultados(message.outputPrompt, message.lastCodeExecuted);
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
    // También tenemos que sacar el texto para la consulta
    const consulta = document.getElementById('chat-input').value.trim();
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
    // Vamos a preparar el fichero y enviarlo al TS
    const reader = new FileReader();
    reader.onload = function(event) {
        const fileContent  = event.target.result;
        // Una vez preparado creamos el mensaje y lo mandamos
        mensaje = { // Estructura mensaje que vamos a enviar al TS
            command: 'ipai-consulta',
            fichero: fileContent,
            nombre: fichero.name,
            extension: extension,
            consulta: consulta
        };
        vscode.postMessage(mensaje);
    };
    reader.readAsDataURL(fichero);
}
//----------------------------------------------------------------------------//
/**
 * TRIGGER --> send-btn
 * 
 * Activamos la comunicación al hacer click sobre el botón de enviar
 * Primero que nada añadimos el div con el prompt de consulta y luego le pasamos todo el material a la extensión para que la procese
 */
document.getElementById('send-btn').addEventListener('click', function(){
    comunicacion();
    addMessage();
    
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
        comunicacion();
        addMessage();
    }
});
