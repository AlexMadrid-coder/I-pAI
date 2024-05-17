/** Todos los listeners */
// Listener para cambiar automáticamente el tamaño del textaure 'ipai-sendText'
document.getElementById('ipai-sendText').addEventListener('input', function () {
    this.style.height = 'auto';                     // Resetea la altura para recalcularle
    this.style.height = this.scrollHeight + 'px';   // Ajustamos la altura del textarea para el contenido 
});