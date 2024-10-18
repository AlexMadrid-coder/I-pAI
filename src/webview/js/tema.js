/**
 * Esta función va a cambiar todos los temas que tenemos de oscuros a claros
 * 
 * Como también tenemos generación de divs, tendremos que complicar la lógica de estas funciones
 * 
 */
export function cambiarTema() {
    // Cambiamos el body que nos servirá de referencia para el resto
    document.body.classList.toggle('body-light');
    // Cambiamos todos los cuadrados ya creados
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        if (document.body.classList.contains('body-light')) {
            square.classList.add('square-light');
        } else {
            square.classList.remove('square-light');
        }
    });
    // Ahora cambiamos la configuración de la navbar
    const nav = document.querySelector('nav');
    // Cambiamos la base de color de la barra de navegación
    nav.classList.toggle('navbar-dark');
    nav.classList.toggle('navbar-light');
    // Cambiamos el color de fondo de la barra de navegación
    nav.classList.toggle('bg-dark');
    nav.classList.toggle('bg-light');
}
/**
 * Función que nos devuelve si el tema actual es claro u oscuro
 * 
 * @returns {boolean} Si el tema actual es o no claro
 */
export function actualTheme() {
    return document.body.classList.contains('body-light') ? true : false;
}