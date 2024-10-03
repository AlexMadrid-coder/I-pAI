// Variables globales para la gestión de la lógica del programa
let fileUploaded = false;

/**
 * TRIGGER --> Nav-Links
 * 
 * Crea la navegabilidad entre las diferentes pestañas de la extensión
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
/**
 * TRIGGER --> chat-input
 * 
 * Hacemos que el textarea 'chat-input' se expanda verticalmente en vez de horizontalmente
 */
document.getElementById('chat-input').addEventListener('input', function() {
    const chatInput = document.getElementById('chat-input');
    // Una vez sacado --> Lo modificamos
    chatInput.style.height = 'auto';
    chatInput.style.height = chatInput.scrollHeight + 'px';
});
/**
 * TRIGGER --> custom-upload-btn + upload-btn
 * 
 * Cambiamos la apariencia del botón para subir el fichero si lo tenemos o no
 * 
 *      Si fichero subido -->       Apariencia Eliminar Fichero
 *      Si fichero no subido -->    Apariencia Subir Fichero
 */
document.getElementById('custom-upload-btn').addEventListener('click', function() {
    const btn =         document.getElementById('upload-btn');
    // Ahora aplicamos la lógica del botón con la variable declarada
    if (fileUploaded) { // Caso ya tenemos un fichero subido
        document.getElementById('upload-btn').value = ''; // Eliminamos el fichero
        document.getElementById('custom-upload-btn').textContent = 'Subir Archivo'; // Restauramos el texto original
        document.getElementById('custom-upload-btn').classList.remove('remove-mode'); // Restauramos el color normal
        fileUploaded = false;
    }
    else {
        // Si no tenemos fichero cargado abrimos el selector
        btn.click();
    }
});
document.getElementById('upload-btn').addEventListener('change', function() {
    if (document.getElementById('upload-btn').files.length > 0) {
        // Cuando seleccionamos un fichero
        document.getElementById('custom-upload-btn').textContent = 'Eliminar fichero'; // cambiamos el texto del botón
        document.getElementById('custom-upload-btn').classList.add('remove-mode'); // Cambiamos el formato del botón
        fileUploaded = true;
    }
});
/**
 * FUNCTION addMessage()
 * 
 * Recoge los datos del prompt consulta y crea un div en 'chat-input' con el contenido de la consulta
 * Exportamos la función para poder usarla desde el fichero de comunicación pero la definimos aquí para tener un código más estruturado y organizado
 */
 export function addMessage() {
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
        /**
         * Vamos a crear un div 'esperando' para los usuarios y si puede ser una animación de espera
         * 
         * // TODO: Imagen panda de PandasAI girando poco a poco en forma de esperando
         * 
         * El estilo aplicado va a ser un cuadrado del mismo tipo pero con un borde blanco esperando
         */
        const divEsperando = document.createElement('div');
        divEsperando.classList.add('square-waiting'); // Le metemos la clase de esperando
        divEsperando.id = 'div-waiting'; // Le damos el id para poder manejarlo mejor próximamente
        // Ahora vamos a hacer que aparezca la imagen
        const img = document.createElement('img');
        img.src = '${iconsBaseURI}/pandasai-image.png';
        img.alt = 'Logo PandasAI';
        // Añadimos la imagen al div
        divEsperando.appendChild(img);
        // Ahora lo añadimos todo al div en el que añadimos el div de la chatzone
        document.getElementById('chat-zone').appendChild(divEsperando);
    }
}
/**
 * @function mostrarResultados
 * 
 * @param {String} outputPrompt Prompt de salida recibido del TS
 * @param {String} lasCodeExecuted Código ejecutado para llegar al outputPrompt recibido del TS
 * 
 * Función que muestra en la parte visual el resultado creando un div y los botones necesarios
 */
export function mostrarResultados(outputPrompt, lastCodeExecuted) {
    // Eliminamos el div de esperando
    const divEsperando = document.getElementById('div-waiting');
    if (divEsperando) {
        divEsperando.remove();
    }
    // Creamos un nuevo div para mostrar el resultado
    const divResultado = document.createElement('div');
    divResultado.classList.add('square');
    divResultado.innerText = outputPrompt;
    // Ahora creamos el botón para copiar lastCodeExecuted al portapapeles
    const botonCopiar = document.createElement('button');
    botonCopiar.innerText = 'Copiar código';
    // Ahora hacemos declaramos internamente el listener para copiar el contenido al clipboard
    botonCopiar.addEventListener('click', function() {
        navigator.clipboard.writeText(lastCodeExecuted).then(function() {
            alert('Código copiado al portapapeles!!');
        }).catch(function(error) {
            console.error('Error copiando el texto: ', error);
        });
    });
    // Ahora añadimos el botón al div
    divResultado.appendChild(botonCopiar);
    // Añadimos al div que toca el divResultado
    document.getElementById('chat-zone').appendChild(divResultado);
}
/**
 * @function mostrarError
 * 
 * @param {String} errorMessage Mensaje de error que vamos a tener que mostrar
 */
export function mostrarError(errorMessage) {
    // Primero que nada eliminamos el div de esperando
    const divEsperando = document.getElementById('div-waiting');
    if (divEsperando) {
        divEsperando.remove();
    }
    // Ahora creamos el div para mostrar el mensaje de error
    const divError = document.createElement('div');
    divError.classList.add('square-error');
    divError.innerText = errorMessage;
    // Añadimos el divError al contenedor principal 
    document.getElementById('chat-zone').appendChild(divError);
}
/**
 * TRIGGER --> chat-input
 * 
 * Inhabilitamos el botón de enviar consulta si no tenemos nada escrito en el textarea de consulta
 */
document.getElementById('chat-input').addEventListener('input', function() {
    if (document.getElementById('send-btn').textContent.trim() !== "") {
        document.getElementById('send-btn').disabled = false;
    }
    else {
        document.getElementById('send-btn').disabled = true;
    }
});
