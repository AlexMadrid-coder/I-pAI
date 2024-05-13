// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('We are glad to see you :-)');
	// Con esto conseguimos la dirección de la página web que usamos como front
	const panelHtmlPath = vscode.Uri.file(
		vscode.Uri.joinPath(context.extensionUri, 'src', 'index.html').fsPath
	);
	// Definimos la vista de extension (icon)
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ipai.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from I-pAI!');
	});
	// En esta vamos a crear el panel cuando le demos al comando
	let disposable_view = vscode.commands.registerCommand('ipai.showView', () => {
		// Creamos y mostramos el panel
		const panel = vscode.window.createWebviewPanel(
			'ipai-panel',
			'I-pAI',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
			}
		);
		// Asignamos el contenido html al panel view, como es una uri lo sacamos primero cone l fs.readFile
		panel.webview.html = fs.readFileSync(panelHtmlPath.fsPath, 'utf-8');
	});

	

	// Add commands to the application
	context.subscriptions.push(disposable); // <-- Hello world command
	context.subscriptions.push(disposable_view); // <-- Open webview command
}

// This method is called when your extension is deactivated
export function deactivate() {}
