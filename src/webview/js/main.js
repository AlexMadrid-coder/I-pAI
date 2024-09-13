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

// TODO: Cambiar la apariencia del botón de subir ficheros