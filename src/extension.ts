// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
// Variable global para almacenar el contexto de la extensi'on
let extensionContext: vscode.ExtensionContext;
/**
 * 
 * @param {vscode.ExtensionContext} context - Contexto de la pag. web 
 */
export function activate(context: vscode.ExtensionContext) {
	// guardamos el contexto en la variable global
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
 * Clase que crea el objeto pag. web que insertamos en la 'Primary Sidebar'
 * 
 * @class SidebarProvider 576
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
				// Permitimos le ejecución de scripts de la vista
				enableScripts: true,
				// Configuramos permisos para la carga de recursos locales
				localResourceRoots: 
				[
					vscode.Uri.joinPath(this._extensionUri, 'src', 'webview'), 
				],
			
			};

			// Configuramos el contenido del webview
			const indexPath = vscode.Uri.joinPath(this._extensionUri, 'src', 'webview', 'index.html');
			let html = fs.readFileSync(indexPath.fsPath, 'utf-8');
			// Sacamos las URI verdaderas para los fichero .html, .css, .js y las imágenes
			const jsBaseURI = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'webview', 'js'));
			const cssBaseURI 	= webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'webview', 'css'));
			const iconsBaseURI = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'webview', 'media', 'img'));
			// Reemplazamos para tener las URI correctas
			// Este código cambia todas las instancias con la URI correcta para que el servidor pueda direccionar bien los fichero css, js y html
			html = html.replace(/\${jsBaseURI}/g, 		`${jsBaseURI}/`);
			html = html.replace(/\${cssBaseURI}/g, 		`${cssBaseURI}/`);
			html = html.replace(/\${iconsBaseURI}/g, 	`${iconsBaseURI}/`);
			webviewView.webview.html = html;
			/**
			 * Este apartado del c'odigo hace referencia a la comunicaci'on entre el typescript (vscode) y la p'agina web incrustada de la extension (javascript)
			 */
			webviewView.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'guardarClave':
							extensionContext.globalState.update('claveAPI', message.clave);
							vscode.window.showInformationMessage('Clave API guardada correctamente.');
							break;
						case 'obtenerClave':
							const clave = extensionContext.globalState.get('claveAPI');
							webviewView.webview.postMessage({command: 'claveAPI', clave});
							break;
						case 'error-NoConsulta':
							vscode.window.showWarningMessage("Sin consulta no podemos trabajar");
							break;
						case 'error-NoFichero':
							vscode.window.showWarningMessage("Sin fichero no podemos trabajar correctamente");
							break;
						
					}
				},
				undefined,
				extensionContext.subscriptions
			);
		}
}

// This method is called when your extension is deactivated
/**
 * Funcion que desactiva la extension en vscode
 */
export function deactivate() {}
