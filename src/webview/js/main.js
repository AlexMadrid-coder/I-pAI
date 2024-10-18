
// Variables globales para la gestión de la lógica del programa
let fileUploaded = false;
//----------------------------------------------------------------------------//
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
//----------------------------------------------------------------------------//
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
//----------------------------------------------------------------------------//
/**
 * TRIGGER --> custom-upload-btn + upload-btn
 * 
 * Cambiamos la apariencia del botón para subir el fichero si lo tenemos o no
 * 
 *      Si fichero subido -->       Apariencia Eliminar Fichero
 *      Si fichero no subido -->    Apariencia Subir Fichero
 */
document.getElementById('custom-upload-btn').addEventListener('click', function() {
    const btn = document.getElementById('upload-btn');
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
//----------------------------------------------------------------------------//
document.getElementById('upload-btn').addEventListener('change', function() {
    if (document.getElementById('upload-btn').files.length > 0) {
        // Cuando seleccionamos un fichero
        document.getElementById('custom-upload-btn').textContent = 'Eliminar fichero'; // cambiamos el texto del botón
        document.getElementById('custom-upload-btn').classList.add('remove-mode'); // Cambiamos el formato del botón
        fileUploaded = true;
    }
});
//----------------------------------------------------------------------------//
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
        // Esta línea es por si estamos con los temas claros
        if (document.body.classList.contains('body-light')) { nuevoMensaje.classList.add('square-light'); }
        //
        nuevoMensaje.innerText = mensaje;
        nuevoMensaje.id = 'div-prompt';
        // Metemos el nuevo div en el div chatbot
        document.getElementById('chat-zone').appendChild(nuevoMensaje);
        // Limpiamos el textArea 
        document.getElementById('chat-input').value = "";
        document.getElementById('chat-input').style.height = 'auto';
        // Ahora mostramos el div de esperando ya que el trigger de main.js va a recoger los datos
        document.getElementById('div-waiting').classList.remove('hide');
    }
}
//----------------------------------------------------------------------------//
/**
 * @function mostrarResultados
 * 
 * @param {String} outputPrompt Prompt de salida recibido del TS
 * @param {String} lasCodeExecuted Código ejecutado para llegar al outputPrompt recibido del TS
 * 
 * Función que muestra en la parte visual el resultado creando un div y los botones necesarios
 */
export function mostrarResultados(outputPrompt, lastCodeExecuted) {
    // Escondemos el div de esperando
    console.log(lastCodeExecuted);
    console.log(typeof lastCodeExecuted);
    console.log(outputPrompt);
    console.log(typeof outputPrompt);
    const divEsperando = document.getElementById('div-waiting');
    if (divEsperando) {
        divEsperando.classList.add('hide');
    }
    // Creamos div y p para texto y botón
    const divResultado = document.createElement('div');
    const textoResultado = document.createElement('p');
    // Asignamos el texto al p 
    textoResultado.innerText = outputPrompt;
    // Añadimos las clases al div 
    divResultado.classList.add('square', 'square-success');
    // Línea para el tema claro u oscuro
    if (document.body.classList.contains('body-light')) { divCodigo.classList.add('square-light'); }
    // 
    divResultado.id = 'div-resultado';
    // Ahora creamos el botón para copiar lastCodeExecuted al portapapeles
    const botonCopiar = document.createElement('button');
    botonCopiar.type = 'button';
    botonCopiar.id = 'ipai-copyButton';
    botonCopiar.classList.add('btn', 'btn-primary');
    botonCopiar.innerText = 'Mostrar Código';
    // Creamos el listener para el botón y mostrar el código
    botonCopiar.addEventListener('click', function() {
        const divCodigo = document.createElement('div');
        divCodigo.classList.add('square', 'square-success');
        //
        divCodigo.innerText = lastCodeExecuted;
        document.getElementById('chat-zone').appendChild(divCodigo);
        botonCopiar.remove();
    });  
    // Ahora añadimos los elementos al div
    divResultado.appendChild(textoResultado);
    divResultado.appendChild(botonCopiar);
    // Añadimos al div que toca el divResultado
    document.getElementById('chat-zone').appendChild(divResultado);
}
//----------------------------------------------------------------------------//
/**
 * @function mostrarError
 * 
 * @param {String} errorMessage Mensaje de error que vamos a tener que mostrar
 */
export function mostrarError(errorMessage) {
    // Primero que nada escondemos el div de esperando
    const divEsperando = document.getElementById('div-waiting');
    if (divEsperando) {
        divEsperando.classList.add('hide');
    }
    // Ahora mostramos el div de error
    const divError = document.getElementById('div-error');
    if (divError) {
        divError.classList.remove('hide');
        divError.innerText = errorMessage;
    }
}
//----------------------------------------------------------------------------//
/**
 * TRIGGER --> chat-input
 * Inhabilitamos el botón de enviar consulta si no tenemos nada escrito en el textarea de consulta
 * 
*/
document.getElementById('chat-input').addEventListener('input', function() {
    if (document.getElementById('send-btn').textContent.trim() !== "") {
        document.getElementById('send-btn').disabled = false;
    }
    else {
        document.getElementById('send-btn').disabled = true;
    }
});

