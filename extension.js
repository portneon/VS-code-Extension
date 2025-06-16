const vscode = require("vscode");
const path = require("path");

function activate(context) {
  let disposable = vscode.commands.registerCommand("extension.showReactWebview", function () {
    const panel = vscode.window.createWebviewPanel(
      "reactWebview",
      "React Webview",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(__dirname, "dist"))],
      }
    );

    panel.webview.html = getWebviewContent(panel);
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(panel) {
  const bundlePath = vscode.Uri.file(
    path.join(__dirname, "dist", "bundle.js")
  );
  const bundleUri = panel.webview.asWebviewUri(bundlePath);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>React Webview</title>
    </head>
    <body>
      <div id="root"></div>
      <script src="${bundleUri}"></script>
    </body>
    </html>
  `;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
