// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'ipai-viewContainer',
			new MiProvider(),
			{
				webviewOptions: {retainContextWhenHidden: true}
			}
		)
	);

}

// tenemos que definir la clase del provider de WebviewViewProvider
class MiProvider implements vscode.WebviewViewProvider {
	public resolveWebviewView(webviewView: vscode.WebviewView): void {
		const panel = webviewView.webview;

		// cargamos el contenido html del fichero
		panel.html = 
		`
		<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>I-pAI</title>
</head>
<body>
    <div id="app">
        hola
    </div>
</body>
</html>
		`;
		console.log(panel.html);
	}
}
// This method is called when your extension is deactivated

export function deactivate() {}
