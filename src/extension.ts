import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.removeCssCommentsInBlocks', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();

            const modifiedText = removeCommentsFromCSSBlocks(text);

            editor.edit((editBuilder) => {
                const firstLine = document.lineAt(0);
                const lastLine = document.lineAt(document.lineCount - 1);
                const range = new vscode.Range(firstLine.range.start, lastLine.range.end);
                editBuilder.replace(range, modifiedText);
            });
        }
    });

    context.subscriptions.push(disposable);
}

function removeCommentsFromCSSBlocks(cssText: string): string {
  return cssText.replace(/\{[^{}]*\/\*[\s\S]*?\*\/[^{}]*\}/g, (match) => {
    return match.replace(/\/\*[\s\S]*?\*\//g, '');
  });
}
export function deactivate() {}
