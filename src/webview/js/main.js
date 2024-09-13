/**
 * Listener para la navegaci'on entre pestanyas
 */
document.addEventListener("DOMContentLoaded", function() {
    // Get all the nav-link buttons
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add click event listener to each button
    navLinks.forEach(navLink => {
        navLink.addEventListener('click', function() {
            // Remove active class from all nav-link buttons
            navLinks.forEach(link => link.classList.remove('active'));

            // Add active class to the clicked nav-link button
            this.classList.add('active');

            // Get all tab panes
            const tabPanes = document.querySelectorAll('.tab-pane');

            // Remove show and active classes from all tab panes
            tabPanes.forEach(tabPane => {
                tabPane.classList.remove('show', 'active');
            });

            // Add show and active classes to the target tab pane
            const targetPane = document.querySelector(this.dataset.bsTarget);
            targetPane.classList.add('show', 'active');
        });
    });
});


document.getElementById('chat-input').addEventListener('input', function() {
    const chatInput = document.getElementById('chat-input');
    // Una vez sacado --> Lo modificamos
    chatInput.style.height = 'auto';
    chatInput.style.height = chatInput.scrollHeight + 'px';
});

/** Cambiamos la apariencia del botón de subir ficheros y hacemos un trigger del verdadero botón que hemos ocultado */
document.getElementById('custom-upload-btn').addEventListener('click', function() {
    const btn =         document.getElementById('upload-btn');
    // Ahora cuando hacemos click en el botón falso activamos el trigger del verdadero botón
    btn.click(); // Aparecerá la ventana de subir el archivo y simplemente queda subir algo.
});

// Vamos a crear la funcionalidad para generar nuevos cuadrados cuando realizamos preguntas y respuestas
/**
 * Función que crea el div con el prompt pregunta a nuestro chatbot
 */
function addMessage() {
    // Aquí vamos a añadir una condición por si existe el 'square' inicial tenemos que eliminarlo por estética
    if (document.getElementById('chat-zone-init')) {
        document.getElementById('chat-zone-init').remove();
    }
    
    const mensaje = document.getElementById('chat-input').value.trim();
    if (mensaje !== "") {
        // Creamos el div que contendrá el mensaje
        const nuevoMensaje = document.createElement('div');
        nuevoMensaje.classList.add('square');

        // Ahora metemos como párrafo el texto de la pregunta
        const parrafo = document.createElement('p');
        parrafo.textContent = mensaje;

        // Metemos el parrafo en el nuevo div
        nuevoMensaje.appendChild(parrafo);

        // Metemos el nuevo div en el div chatbot
        document.getElementById('chat-zone').appendChild(nuevoMensaje);

        // Limpiamos el textArea 
        document.getElementById('chat-input').value = "";
        document.getElementById('chat-input').style.height = 'auto';
    }
}
/**
 * Listener para cuando tocamos el botón de enviar
 */
document.getElementById('send-btn').addEventListener('click', addMessage);
/**
 * Listener para cuando presionamos el botón enter pero no combinado con shift
 */
document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addMessage;
    }
});