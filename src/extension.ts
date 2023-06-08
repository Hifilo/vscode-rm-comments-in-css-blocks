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
    let isInSelector = false;
    let output = '';

    for (let i = 0; i < cssText.length; i++) {
        if (cssText[i] === '{') {
            isInSelector = true;
        } else if (cssText[i] === '}') {
            isInSelector = false;
        }

        if (!isInSelector || cssText[i] !== '/') {
            output += cssText[i];
        } else if (cssText[i + 1] === '*') {
            // Skip characters until the closing '*/' is found
            while (cssText[i] !== '*' || cssText[i + 1] !== '/') {
                i++;
            }

            i++; // Skip the '/'
        }
    }

    return output;
}

export function deactivate() {}
