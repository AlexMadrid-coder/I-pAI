// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
/**
 * Declaración de variables globales
 */
let extensionContext: vscode.ExtensionContext; // Contexto que usamos para la gestión de la comunicación entre JS-TS
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
/**
 * CLASS SidebarProvider
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
							const clave = extensionContext.globalState.get('claveAPI');
							webviewView.webview.postMessage({command: 'claveAPI', clave});
							break;
						case 'error-NoConsulta': // Gestión de error --> No hemos subido consulta
							vscode.window.showWarningMessage("Sin consulta no podemos trabajar");
							break;
						case 'error-NoFichero': // Gestión de error --> No hemos subido fichero
							vscode.window.showWarningMessage("Sin fichero no podemos trabajar correctamente");
							break;
						case 'error-FormatoIncorrecto': // Gestión de error --> El formato del fichero es incorrecto
							vscode.window.showWarningMessage("Extensión " + message.error + " incorrecto");
							break;
						case 'ipai-consulta': // Caso principal de la extensión --> Hacer la consulta
							const nombre = message.nombre;
							const extension = message.extension;
							const consulta = message.consulta;
							const contenido = message.fileContent.split(','[1]);
							
							break;
						
					}
				},
				undefined,
				extensionContext.subscriptions
			);
		}
}
/**
 * FUNCTION executePython
 * 
 * Funcionamiento principal de la gestión TS-Python
 * 
 * 1. Creamos el child_process de Python y le pasamos los argumentos correctos
 * 2. Esperamos a que devuelva el contenido el proceso
 * 3. Matamos el proceso 
 */
function executePython() {

}
/**
 * Función que desactiva la extensión cuando el propio Visual Studio Code lo necesita
 */
export function deactivate() {}
