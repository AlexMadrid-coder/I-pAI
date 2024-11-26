// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import * as fs from 'fs';
import { spawn } from 'child_process';
/**
 * Declaración de variables globales
 */
let extensionContext: vscode.ExtensionContext; // Contexto que usamos para la gestión de la comunicación entre JS-TS
// La variable va a sacar sobre que sistema operativo estamos trabajando
const isWindows = process.platform === 'win32';
// Sacamos que intérprete de Python utilizar dependiendo de nuestro sistema operativo
const interpretePytohnUri = isWindows
	? vscode.Uri.joinPath(vscode.Uri.file(__dirname), '..', 'src', 'python', 'venv-windows', 'Scripts', 'python.exe')
	: vscode.Uri.joinPath(vscode.Uri.file(__dirname), '..', 'src', 'python', 'venv-linux', 'bin', 'python');
// Vamos a guardar los logs en nuestro fichero predeterminado
const logsPandasaiUri = vscode.Uri.joinPath(vscode.Uri.file(__dirname), '..', 'src', 'python', 'pandasai.log');
const ficheroPythonUri = vscode.Uri.joinPath(vscode.Uri.file(__dirname), '..', 'src', 'python', 'script.py');
// Ahora hacemos las rutas correctas con las URI
const interpretePytohn = interpretePytohnUri.fsPath;
const ficheroPython = ficheroPythonUri.fsPath;
const logsPandasai = logsPandasaiUri.fsPath;
//----------------------------------------------------------------------------//
/**
 * @interface PythonResult 
 * 
 * @param {String} outputPrompt Output de la salida del fichero Python
 * @param {String} lastExecutedCode C'odigo ejecutado para llegar a la salida
 * 
 * Declarada para la gesti'on de la salida del fichero Python
 */
interface PythonResult {
	outputPrompt: string,
	lastExecutedCode: string;
}
//----------------------------------------------------------------------------//
/**
 * FUNCTION activate 
 * 
 * Motor principal de la extensión, es la encargada de hacer que funciones así como de poder incrustar la pág.web en la primary sidebar 
 * 
 * @param {vscode.ExtensionContext} context - Contexto de la pag. web 
 */
export function activate(context: vscode.ExtensionContext) {
	// Guardamos el contexto de la extensión en el de la API de vscode para poder comunicarnos
	extensionContext = context;
	//
	const provider = new SidebarProvider(context.extensionUri); // Contenido arreglado de la pag. web
	/**
	 * En este apartado suscribimos a nuestra extension todas las opciones y funciones que necesitamos
	 * 
	 */
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('ipai.mainContainer', provider) // Agregamos la pag. web al primary sidebar
	);
}
//----------------------------------------------------------------------------//
/**
 * @class SidebarProvider
 * 
 * esta clase es la implementación del WebViewProvider que nos permite incrustar una página web en la primary sidebar
 */
class SidebarProvider implements vscode.WebviewViewProvider{
	/** 
	 *  Crea la instancia SidebarProvider
	 * 
	 * @param {vscode.Uri} _extensionUri - Uri inicial de la pag. web que queremos usar 
	 */
	constructor(private readonly _extensionUri: vscode.Uri) {}
	/**
	 * Funcion que devuelve la URI real de las paginas con las direcciones de boostrap, css y js
	 * 
	 * @param {vscode.Webview} webviewView 					- Webview a utilizar con las configuraciones propias
	 * @param {vscode.WebviewViewResolveContext} context 	- Contexto de la pag. web
	 * @param {token} vscode.CancellationToken 				- Token de cancelacion para cerrar la pag. web
	 */
	public resolveWebviewView(
		webviewView: vscode.WebviewView, 
		context: vscode.WebviewViewResolveContext, 
		token: vscode.CancellationToken)
		{
			webviewView.webview.options = {
				/**
				 * Permitimos el uso de Scripts únicamente desde las fuentes permitidas
				 */
				enableScripts: true,
				/**
				 * Configuramos los recursos ejecutables de nuestra extensión
				 * 
				 * 		En mi caso únicamente voy a permitir usar lo que tenga en la carpeta interna de recursos de la extensión
				 */
				localResourceRoots: 
				[
					vscode.Uri.joinPath(this._extensionUri, 'src', 'webview'), 
				],
			};
			/**
			 * Configuramos la página principal del WebView de nuestra extensión
			 */
			const indexPath = vscode.Uri.joinPath(this._extensionUri, 'src', 'webview', 'index.html');
			let html = fs.readFileSync(indexPath.fsPath, 'utf-8');
			/**
			 * Sacamos las URI verdaderas
			 * 
			 * 		jsBaseURI es donde tenemos los recursos JavaScript de la extensión
			 * 		cssBaseURI es donde tenemos los recursos CSS de la extensión
			 * 		iconsBaseURI es donde tenemos los recursos audiovisuales de la extensión
			 */
			const jsBaseURI = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'webview', 'js'));
			const cssBaseURI 	= webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'webview', 'css'));
			const iconsBaseURI = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'webview', 'media', 'img'));
			/**
			 * Cambiamos todas las URI por las correctas usando expresiones regulares
			 */
			html = html.replace(/\${jsBaseURI}/g, 		`${jsBaseURI}/`);
			html = html.replace(/\${cssBaseURI}/g, 		`${cssBaseURI}/`);
			html = html.replace(/\${iconsBaseURI}/g, 	`${iconsBaseURI}/`);
			webviewView.webview.html = html;
			/**
			 * Gestión de mensajes JS-TS
			 */
			webviewView.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'guardarClave': // Guardamos la clave en la memoria de la extensión
							extensionContext.globalState.update('claveAPI', message.clave);
							vscode.window.showInformationMessage('Clave API guardada correctamente.');
							break;
						case 'obtenerClave': // Devolvemos al JS la clave de la memoria
							webviewView.webview.postMessage({command: 'claveAPI', 
								clave: extensionContext.globalState.get('claveAPI')});
							break;
						case 'ipai-cambiarTema': // Guardamos le último tema en la memoria
							if (extensionContext.globalState.get('ipai-Tema') === 'changed') {
								extensionContext.globalState.update('ipai-Tema', 'no');
							} else {
								extensionContext.globalState.update('ipai-Tema', message.clave);
							}
							break;
						case 'ipai-getTema': // Devolvemos el tema guardado
							webviewView.webview.postMessage({command: 'ipai-Tema',
								clave: extensionContext.globalState.get('ipai-Tema')});
							break;
						case 'ipai-cambiarLenguaje': // Guardamos en memoria el Lenguaje guardado
								extensionContext.globalState.update('ipai-Lenguaje', message.clave);
							break;
						case 'ipai-getLenguaje': // Devolvemos el lenguaje guardado
								webviewView.webview.postMessage({command: 'ipai-Lenguaje', 
									clave: extensionContext.globalState.get('ipai-Lenguaje')});
							break;
						case 'error-NoConsulta': // Gestión de error --> No hemos subido consulta
							vscode.window.showErrorMessage("No podemos trabajar sin consulta");
							break;
						case 'error-NoFichero': // Gestión de error --> No hemos subido fichero
							vscode.window.showErrorMessage("No podemos trabajar sin fichero");
							break;
						case 'error-FormatoIncorrecto': // Gestión de error --> El formato del fichero es incorrecto
							vscode.window.showErrorMessage("Formato: " + message.error + " incorrecto");
							break;
						case 'ipai-copyClipboard':
							vscode.env.clipboard.writeText(message.lastCodeExecuted).then(() => {
								vscode.window.showInformationMessage('Contenido copiado correctamente');
							});
							break;
						case 'ipai-consulta': // Caso principal de la extensión --> Hacer la consulta
							const nombre = message.nombre;
							const directorio = message.directorio;
							const extension = message.extension;
							const consulta = message.consulta;
							// Hacemos un try-catch con toda la información necesaria
							try { // Ejecutamos el código python
								const claveAPI = extensionContext.globalState.get('claveAPI') as string;
								executePython(directorio, nombre, consulta, extension, claveAPI)
								.then((result) => {
									// Si se resuelve correctamente
									console.log('Proceso Python exitoso');
									const {outputPrompt, lastExecutedCode} = result as PythonResult;
									// Mandamos los resultados al JS
									webviewView.webview.postMessage({ command: 'ipai-resultado', outputPrompt: outputPrompt, lastExecutedCode: lastExecutedCode});
								})
								.catch((error) => {
									// Si la promesa es rechazada
									// Mostramos tanto por consola como por el vscode que ha ocurrido un error
									console.error(`Detectado error: ${error}`);
									vscode.window.showErrorMessage(error);
									// Mandamos mensaje de error al webview y gestionamos mostrar el error visualmente para el usuario
									webviewView.webview.postMessage({ command: 'ipai-error', errorMessage: error});
								});
							}
							catch (error) { // Sacamos la excepcion si no se puede ejecutar el codigo python
								console.error("Error: No se ha podido ejecutar el código Python -> ", error);
								vscode.window.showErrorMessage(`Error: No se ha podido ejecutar el código Python -> , ${error}`);
							}
						break;
					}
				},
				undefined,
				extensionContext.subscriptions
			);
		}
}
//----------------------------------------------------------------------------//
/**
 * FUNCTION executePython
 * 
 * Funcionamiento principal de la gestión TS-Python
 * 
 * 1. Creamos el child_process de Python y le pasamos los argumentos correctos
 * 2. Esperamos a que devuelva el contenido el proceso
 * 3. Matamos el proceso 
 * 
 * @param {string} filePath Path al fichero con el que vamos a trabajar
 * @param {string} inputPrompt Contenido texto de la consulta
 * @param {string} extension Extension que vamos a utilizar para el switch y abrir el flujo de trabajo
 * @param {string} claveAPI Clave API para generar la respuesta
 * 
 * @return {Promise<PythonResult>} Devolvemos si ha funcionado o no además de lo requerido
 */
function executePython(directorio: string, nombre: string, consulta: string, extension: string, claveAPI: string): Promise<PythonResult>  {
	return new Promise((resolve, reject) => {
		// Creamos el proceso Python con los argumentos necesarios
		const pythonProcess = spawn(interpretePytohn, [ficheroPython, directorio, nombre, consulta, extension, claveAPI], {
			stdio: ['pipe', 'pipe', 'pipe']
		});
		// Sacamos los resultados en esta variable pero no debería salir nada sino al salir
		let result = '';
		// Ahora tenemos que escuchar la salida stout del python
		pythonProcess.stdout.on('data', (data) => {
			const output = data.toString();
			// Descomentar para comprobar todas las salidas de texto de python
			// console.log(`Salida de python: ${data.toString()}`);
			result += output; // Guardamos la salida de Python 
		});
		// También escuchamos los errores del proceso
		pythonProcess.stderr.on('data', (data) => {
			// Devolvemos rechazo
			console.log(`Salida error de python -->  ${data.toString()}`);
			reject(`Error de Python: ${data.toString()}`);
		});
		// Cuando el proceso termina, procesamos la salida como JSON
		pythonProcess.on('close', (code) => {
			if (code === 0) { // Salida correcta
				try {
					const salidaJSON = JSON.parse(result);
					const outputPrompt = salidaJSON.prompt_output;
					const lastExecutedCode = salidaJSON.last_code_executed;
					// Acabamos la promesa con la solución
					resolve({outputPrompt, lastExecutedCode});
				}
				catch (error) {
					// Devolvemos rechazo
					reject(`Error al parsear la respuesta de Python: ${error}`);
				}
			} else {
				// Devolvemos rechazo
				reject(`Proceso Python finalizó con código ${code}`);
			}
		});
	});
}
//----------------------------------------------------------------------------//
/**
 * Función que desactiva la extensión cuando el propio Visual Studio Code lo necesita
 */
export function deactivate() {}
