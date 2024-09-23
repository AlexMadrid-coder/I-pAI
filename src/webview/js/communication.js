import { addMessage } from './main.js'; 

//
const vscode = acquireVsCodeApi(); // Con esto creamos el flujo vscode-webview

/**
 * Hacemos la funci'on de comunicaci'on de esta manera para tener ya cargada la extensi'on para tener la posibilidad de comunicarnos
 */
document.addEventListener('DOMContentLoaded', function() {

    /**
     * Este es el hom'ologo a hacer una funci'on que envie los datos
     */
    document.getElementById('guardarBtn').addEventListener('click', () => {
        const clave = document.getElementById('claveInput').value;
        vscode.postMessage({command: 'guardarClave', clave: clave});
    });

    /**
     * Ahora hacemos que siempre que se cargue se solicite la clave al abrir aunque no est'e disponible
     */
    vscode.postMessage({command: 'obtenerClave'});
    /**
     * Aquí tenemos la lógica de la recepción de mensajes del TypeScript
     */
    window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'claveAPI' && message.clave) {
            document.getElementById('claveInput').value = message.clave;
        }
    });
});
// Vamos a declarar una función que hará todo lo que necesitamos para recoger y enviar al TypeScript
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
    // Ahora tenemos que enviar al TypeScript la constulta y el fichero
}
/**
 * En estos listener vamos a gestionar el funcionamiento principal de la interacción JavaScript-TypeScript
 */

document.getElementById('send-btn').addEventListener('click', function(){
    comunicacion();
    addMessage();
});
document.getElementById('chat-input').addEventListener('keydown', function(event){
    if (event.key === 'Enter') {
        event.preventDefault();
        comunicacion();
        addMessage();
    }
});
