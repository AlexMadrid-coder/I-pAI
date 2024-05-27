/** Todos los listeners */
/**
 * Listener para cambiar el alto del campo ipai-sendText cuando metemos un salto de línea
 */
document.getElementById('ipai-sendText').addEventListener('input', function () {
    this.style.height = 'auto';                     // Resetea la altura para recalcularle
    this.style.height = this.scrollHeight + 'px';   // Ajustamos la altura del textarea para el contenido 
});
/**
 * Listene -->'enter' en el textarea
 */
document.getElementById('ipai-sendText').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        ipai_ASK();
    }
});
/**
 * Listener --> Botón de enviar del areatext
 */
document.getElementById('ipai-sendButton').addEventListener('click', function() {
    ipai_ASK();
});
// 

// Definición de funciones
/**
 * Esta función es la encargada de aplicar los cambios necesarios para los listeners
 *  del 'areatext' y del 'sendbutton'
 */
function ipai_ASK() {
    // Sacamos la información del div que aloja todos los query
    const divsQuery = document.getElementById('block-query');
    // Ahora cogemos todos sus hijos ( preguntas y respuestas del LLE )
    const childs = divsQuery.childs();
    // Ahora si tenemos el id 'ipai-div-initial' --> Eliminamos y mandamos pregunta
    const initialDiv = document.getElementById('ipai-div-initial');
    if (initialDiv) {
        divsQuery.removeChild(initialDiv);
    }

    // Creamos un nuevo div para la pregunta
    const userInput = document.getElementById('ipai-sendText').ariaValueMax.trim();
    if (userInput) {
        const newDiv = document.createElement('div');
        newDiv.id = 'user-query';
        newDiv.className = 'user-query';
        newDiv.textContent = userInput;
        divsQuery.appendChild(newDiv);

        // Limpiamos el textArea
        document.getElementById('ipai-sendText').value = '';
        // Reset de altura
        document.getElementById('ipai-sendText').style.height = 'auto';
    }
};