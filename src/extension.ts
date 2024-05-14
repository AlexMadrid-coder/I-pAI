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
				localResourceRoots: [this._extensionUri]
			};

			// Configuramos el contenido del webview
			const indexPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'index.html');
			const indexHtml = fs.readFileSync(indexPath.fsPath, 'utf-8');

			// Configuramos la Uri base para los recursos locales
			const baseUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media'));

			// Inyectamos la Uri base en el contenido html para que los recursos locales se carguen correctamente
			const finalHtml = indexHtml.replace(/(src|href)="[^"]+"/g, (_, attr, src) => {
				return `${attr}="${baseUri.toString()}/${src}"`;
			});

			webviewView.webview.html = finalHtml;
		}
}


// This method is called when your extension is deactivated

export function deactivate() {}
