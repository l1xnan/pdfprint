/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { SaveDialogOptions, WebviewTag, ipcRenderer } from "electron";

import * as fs from "fs";
import * as path from "path";

import "./index.css";

function hello(name: string) {
  console.log(`👋 Hello ${name}`);
}
console.log(
  '👋 This message is being logged by "renderer.js", included via Vite'
);

hello("Electron");

function createWebview() {
  const webview = document.createElement("webview") as WebviewTag;
  webview.src = "https://pandoc.org/MANUAL.html";
  webview.setAttribute("style", "height:80vh;width:100vw")
  // webview.preload = `file://./node_modules/pagedjs/dist/paged.polyfill.min.js`;

  // webview.preload = "file:./preload.js";
  document.body.appendChild(webview);

  // webview.openDevTools();
  return webview;
}

async function printToPDF() {
  const element = document.getElementsByTagName("webview")[0] as WebviewTag;
  console.log(element);

  const data = await element.printToPDF({});

  const filePath = (await showSaveDialog({}))?.filePath;
  if (filePath) {
    fs.writeFile(filePath, data, (error) => {
      if (error) throw error;
      console.log("保存成功");
    });
  }
}

function openDevTools() {
  const webview = document.getElementsByTagName("webview")[0] as WebviewTag;

  webview.openDevTools();
}

async function showSaveDialog(options: SaveDialogOptions) {
  try {
    const result = await ipcRenderer.invoke("show-save-dialog", {
      title: "保存文件",
      // defaultPath: '/path/to/default/file.txt',
      buttonLabel: "保存",
      filters: [
        { name: "PDF文件", extensions: ["pdf"] },
        { name: "所有文件", extensions: ["*"] },
      ],
      ...options,
    });
    console.log(result.filePath);
    return result;
  } catch (err) {
    console.log(err);
  }
}
createWebview();

document.getElementById("print-to-pdf").addEventListener("click", printToPDF);
document
  .getElementById("open-devtools")
  .addEventListener("click", openDevTools);
