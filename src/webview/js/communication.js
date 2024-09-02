/**
 * Hacemos la funci'on de comunicaci'on de esta manera para tener ya cargada la extensi'on para tener la posibilidad de comunicarnos
 */
document.addEventListener('DOMContentLoaded', function() {
    const vscode = acquireVsCodeApi();

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
     * 
     */
    window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'claveAPI' && message.clave) {
            document.getElementById('claveInput').value = message.clave;
        }
    });
});