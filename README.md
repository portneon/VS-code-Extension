# VS Code Notes Extension

A simple Visual Studio Code extension that opens a React-based webview to let users write, save, and clear personal notes right inside VS Code!
we are gonna add more cool features soon!
---

##  Current Features

-  Write and save quick notes
-  Stores notes using browser `localStorage`
-  Loads saved notes automatically
-  Built using **React**, **Webpack**, and **VS Code API**

---

##  Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Visual Studio Code](https://code.visualstudio.com/)
- `npm` (comes with Node.js)

---

##  Setup Instructions

### 1. Clone the repository

```bash```
git clone [https://github.com/your-username/VS-code-Extension.git](https://github.com/nst-sdc/VS-code-Extension.git)
<br/> cd VS-code-Extension

### 2. Install dependencies
npm install

### 3. Build the React Webview
npx webpack

Wondering how to run the extension? here you go:
1. Open the folder in VS Code
2. Press F5 to launch an Extension Development Host.
3. In the new VS Code window, open Command Palette (Ctrl+Shift+P or Cmd+Shift+P) and search:
"Show React Webview"

### Tadaaa! Your note-taking UI will now appear!

## Folder structure

vscode-notes-extension/
├── .vscode/
│   └── launch.json          # VS Code debugger config
├── dist/
│   └── bundle.js            # Webview output by Webpack
├── src/
│   ├── App.js               # React component for notes
│   └── index.js             # Entry file for Webpack
├── extension.js             # Main VS Code extension logic
├── package.json             # Project metadata & dependencies
├── webpack.config.js        # Webpack config file
└── README.md                # This file



## Scripts
In package.json, you can add:

"scripts": {
  "build": "webpack",
  "watch": "webpack --watch"}

then run:
npm run build    # One-time build
npm run watch    # Auto-rebuild on changes

## Contributing
Want to improve this extension? Awesome!

1. Fork the repo.

2. Create a new branch:
command: git checkout -b feature/your-feature

3. Make your changes and build: 
command: npx webpack

4. Commit and push:
commands: git add .
git commit -m "Add: your message"
git push origin feature/your-feature

5. Open a Pull Request.

## Gotchas
1. Missing CLI error? Run:
npm install -D webpack-cli

2. Not seeing your changes? Rebuild with npx webpack and restart the Extension Host window.

### Made with 💙 by @sakina1303





