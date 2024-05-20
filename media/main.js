/** Todos los listeners */
/**
 * Listener para cambiar el alto del campo ipai-sendText cuando metemos un salto de línea
 */
document.getElementById('ipai-sendText').addEventListener('input', function () {
    this.style.height = 'auto';                     // Resetea la altura para recalcularle
    this.style.height = this.scrollHeight + 'px';   // Ajustamos la altura del textarea para el contenido 
});
/**
 * 
 */

// 

// Definición de funciones
/**
 *  Esta función crea la instancia pregunta del dataset y la muestra por pantalla
 */
const askIpAI = () => {
    textarea = document.getElementById('ipai-sendText').value;
    divQuery = document.getElementById('block-query');
    
};