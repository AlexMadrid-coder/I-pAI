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

/**
 * Vamos a hacer el trigger al bot'on de enviar para que recoja las cosas y las mande al typescript para procesarlo en python-PandasAI
 */
document.getElementById('upload-btn').addEventListener('change', function() {
    // Una vez disparado vamos a realizar la misma comprobaci'on que el otro disparador
    const fichero = document.getElementById('upload-btn').files[0];
    const consulta = document.getElementById('chat-input').value.trim();
    // Ahora hacemos las comprobaciones
    if (consulta === "") {
        alert("Necesitamos una consulta para consultar");
        return;
    }
    if (!file) { alert("No has subido ning'un archivo!!"); return; }

    // Lee el fichero como ArrayBuffer
    const reader = new FileReader();
    reader.onload = function(event) {
        const arrayBuffer = event.target.result;

        // Enviamos la consulta al backend

    };
    // Ahora creamos la estructura a enviar
    const messageData = {
        command: 'realizarConsulta',
        query: consulta,
        fileName: fichero.name,
        fileContent: null
    };

    // Ahora vamos a leer el fichero para enviarlo
});