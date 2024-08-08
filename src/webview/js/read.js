const fs = require('fs');
const path = require('path');


/**
 * 
 * @param {*} filepath Es el 'path' del archivo .ipynb sobre el que vamos a realizar una lectura de variables
 * 
 * Funci'on encargada de leer todas las variables del fichero.
 * Posteriormente se buscar'a un parseo para variables de un tipo especifico
 */
function readNotebook(filepath) {
    const fileContent = fs.readFileSync(filepath, 'utf-8');
    const notebook = JSON.parse(fileContent);

    // Una vez tenemos el contenido del fichero podemos operar
    notebook.cells.forEach(cell => {
        if (cell.cell_type === 'code') {
            console.log(cell.source); // Aqu'i mostramos las celdas con codigo
        }
    });

}