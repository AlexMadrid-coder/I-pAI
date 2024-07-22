// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const provider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('ipai.mainContainer', provider)
	);
}
class SidebarProvider implements vscode.WebviewViewProvider{
	constructor(private readonly _extensionUri: vscode.Uri) {}

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
		}
}


// This method is called when your extension is deactivated

export function deactivate() {}
