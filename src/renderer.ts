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

import { WebviewTag } from "electron";
import "./index.css";

function hello(name: string) {
  console.log(`👋 Hello ${name}`);
}
console.log(
  '👋 This message is being logged by "renderer.js", included via Vite'
);

hello("Electron");

function createWebview() {
  var webview: any = document.createElement("webview");
  webview.src = "https://pandoc.org/MANUAL.html";
  webview.preload = `file://./node_modules/pagedjs/dist/paged.polyfill.min.js`;
  return webview;
}
// createWebview();

function printToPDF() {
  const element = document.getElementsByTagName("webview")[0] as WebviewTag;
  console.log(element);

  element.printToPDF({}).then((res) => {
    console.log(res);
  });
}

document
  .getElementsByTagName("button")[0]
  .addEventListener("click", printToPDF);
