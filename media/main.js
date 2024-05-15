document.addEventListener('DOMContentLoaded', function () {
    const  buttons = document.querySelectorAll('.action-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`Button ${button.textContent} clicked`);
        });
    });
});

const input = document.getElementById('userInput');
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        console.log(`Input submitted: ${input.value}`);
    }
});