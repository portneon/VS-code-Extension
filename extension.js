const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const https = require("https");

const EXCLUDED_NAMES = [
  "node_modules", ".git", ".DS_Store", "package-lock.json", "yarn.lock",
  "dist", ".vscode", ".idea", ".env"
];

function activate(context) {
  const baseFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!baseFolder) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }

  let activeFolder = baseFolder;

  const showWebviewCommand = vscode.commands.registerCommand("extension.showReactWebview", async () => {
    const panel = vscode.window.createWebviewPanel(
      "reactWebview",
      "Code Companion",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(__dirname, "dist"))],
        retainContextWhenHidden: true,
      }
    );

    panel.webview.html = getWebviewContent(panel);

    const sendTree = () => {
      const tree = getFolderTree(baseFolder, activeFolder);
      const activeFilePath = vscode.window.activeTextEditor?.document.uri.fsPath;
      const relativeToActive = activeFilePath ? path.relative(activeFolder, activeFilePath) : "";
      panel.webview.postMessage({ type: "treeData", tree, activePath: relativeToActive });
    };
    

    // Delay initial send to ensure React is mounted... ye dikkat tha pahle issliye add kiya hai
    setTimeout(() => sendTree(), 500);

    const watcher = fs.watch(baseFolder, { recursive: true }, () => sendTree());
    panel.onDidDispose(() => watcher.close());

    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        const filePath = editor.document.uri.fsPath;
        const folder = path.dirname(filePath);
        activeFolder = folder;
        sendTree();
      }
    });

    panel.webview.onDidReceiveMessage(
      (message) => {
        if (message.command === "alert") {
          vscode.window.showInformationMessage(message.text);
        }
      },
      undefined,
      context.subscriptions
    );
  });

  const stackOverflowCommand = vscode.commands.registerCommand("extension.searchStackOverflow", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection).trim();

    if (!selectedText) {
      vscode.window.showInformationMessage("Please select some code to search.");
      return;
    }

    const query = encodeURIComponent(selectedText);
    const options = {
      hostname: "api.stackexchange.com",
      path: `/2.3/search/advanced?order=desc&sort=relevance&q=${query}&site=stackoverflow`,
      headers: { "User-Agent": "vscode-extension" }
    };

    https.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (!Array.isArray(parsed.items) || parsed.items.length === 0) {
            vscode.window.showInformationMessage("No results found on Stack Overflow.");
            return;
          }

          const topResults = parsed.items.slice(0, 3);
          const markdown = new vscode.MarkdownString(
            topResults.map((item, i) => `**${i + 1}. [${item.title}](${item.link})**`).join("\n\n")
          );
          markdown.isTrusted = true;

          const hover = new vscode.Hover(markdown);
          const provider = { provideHover() { return hover; } };

          const disposableHover = vscode.languages.registerHoverProvider("*", provider);
          context.subscriptions.push(disposableHover);

          vscode.window.showInformationMessage("Hover over the selected code to see Stack Overflow results.");
        } catch (err) {
          vscode.window.showErrorMessage("Error parsing Stack Overflow response.");
        }
      });
    }).on("error", (err) => {
      vscode.window.showErrorMessage("HTTPS request failed.");
    });
  });

  context.subscriptions.push(showWebviewCommand, stackOverflowCommand);
}

function getFolderTree(dirPath, basePath = dirPath) {
  const result = [];
  let items;
  try {
    items = fs.readdirSync(dirPath);
  } catch (e) {
    return result;
  }

  items.forEach((item) => {
    if (EXCLUDED_NAMES.includes(item)) return;

    const fullPath = path.join(dirPath, item);
    let stats;
    try {
      stats = fs.statSync(fullPath);
    } catch {
      return;
    }

    const relativePath = path.relative(basePath, fullPath);

    const node = {
      name: item,
      path: relativePath,
      isDirectory: stats.isDirectory(),
      children: [],
    };

    if (stats.isDirectory()) {
      node.children = getFolderTree(fullPath, basePath);
      if (node.children.length === 0) return;
    }

    result.push(node);
  });

  return result;
}

function getWebviewContent(panel) {
  const bundlePath = vscode.Uri.file(path.join(__dirname, "dist", "bundle.js"));
  const bundleUri = panel.webview.asWebviewUri(bundlePath);
  const nonce = getNonce();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src data: https:; connect-src *;">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Folder Tree</title>
      <style>
        body { font-family: sans-serif; padding: 10px; background: #1e1e1e; color: white; }
        ul { list-style-type: none; padding-left: 1em; }
        li { margin: 0.2em 0; cursor: pointer; }
        li span:hover { background: rgba(255,255,255,0.1); }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" src="${bundleUri}"></script>
    </body>
    </html>
  `;
}

function getNonce() {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 32 }, () =>
    possible.charAt(Math.floor(Math.random() * possible.length))
  ).join("");
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
