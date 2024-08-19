/**
 * Esta función en tiempo real se encarga de evitar el cambio entre páginas o cargar contenido sobre la página principal teniendo todo
 *  el contenido escrito sobre la principal y solo mostrar la seleccionada en la barra de navegación principal
 */
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Primero ocultamos todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        // Ahora mostramos la sección correspondiente
        const target = document.querySelector(this.getAttribute('data-target'));
        target.classList.add('active');
    });
});