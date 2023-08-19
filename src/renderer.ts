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

import * as fs from "fs";

import "./index.css";
import { getContents, showSaveDialog } from "./renderer/ipc";
import { addBookmarks, getHeadingPosition } from "./renderer/pdf";

function hello(name: string) {
  console.log(`👋 Hello ${name}`);
}
console.log('👋 This message is being logged by "renderer.js", included via Vite');

hello("Electron");

function createWebview() {
  const webview = document.createElement("webview") as WebviewTag;
  // webview.src = "https://pandoc.org/MANUAL.html";
  webview.src = "https://pandoc.org/installing.html";
  webview.setAttribute("style", "height:80vh;width:100vw");
  webview.nodeintegration = true;
  // webview.preload = `file://./node_modules/pagedjs/dist/paged.polyfill.min.js`;

  // webview.preload = "file:./preload.js";
  document.body.appendChild(webview);

  // const id = webview.getWebContentsId();
  // const webviewContents = webContents.fromId(id);
  // // 在 webview 加载完成后执行回调函数
  // webviewContents.on("did-finish-load", () => {
  //   // 获取 webview 中的 HTML 内容
  //   webviewContents.executeJavaScript(
  //     `
  //   document.documentElement.outerHTML;
  // `,
  //     (result: any) => {
  //       // 将 HTML 内容传递给渲染进程
  //       mainWindow.webContents.send("html-content", result);
  //     }
  //   );
  // });

  return webview;
}

async function printToPDF() {
  // const element = document.getElementsByTagName("webview")[0] as WebviewTag;
  const webview = document.querySelector("webview") as WebviewTag;

  console.log(webview);

  const headings = await getHeadings(webview);
  console.log(headings);
  // return;

  const data = await webview.printToPDF({});

  const filePath = (await showSaveDialog({}))?.filePath;

  const posistions = await getHeadingPosition(data);
  console.log(headings);
  addBookmarks(data, headings, posistions);
  if (filePath) {
    fs.writeFile(filePath, data, (error) => {
      if (error) throw error;
      console.log("保存成功");
    });
  }
}

/**
 * 获取标题
 * @param webview
 * @returns
 *
 * ```
 * const data = [];
 * document.querySelectorAll("h1").forEach((item) => {
 *   data.push(item.innerText);
 * });
 * data
 * ```
 */
async function getHeadings(webview: WebviewTag) {
  const tree = await webview.executeJavaScript(`$api.getHeadingTree()`);
  console.log("Tree", tree);
  return tree;
}

async function openDevTools() {
  const webview = document.querySelector("webview") as WebviewTag;
  webview.openDevTools();
}

async function test() {
  // console.log(window.$api);
  // const webview = document.querySelector("webview") as WebviewTag;
  // webview.send("eventName")
  // 发送事件给 Webview
  // const electronAPI = window.electronAPI;
  // electronAPI.getHeadings();
  const contents = getContents();
  console.log(contents);
  const webview = document.querySelector("webview") as WebviewTag;
  // webview.addEventListener("ipc-message", (event) => {
  //   console.log(event.channel);
  //   console.log(event);
  //   // Prints "pong"
  // });

  // const resultPromise = new Promise((resolve, reject) => {
  //   webview.addEventListener("ipc-message", (event) => {
  //     console.log(event);
  //     if (event.channel === "pong1") {
  //       resolve(event);
  //     }
  //   });
  // });

  webview.send("ping");

  // const data = await resultPromise;
  // console.log(data);
  // ipcRenderer.sendToHost("eventName", "eventData");

  // // 接收来自 Webview 的结果
  // const res = await ipcRenderer.invoke("resultEventName");
  // console.log(res);
}

const webview = createWebview();

webview.addEventListener("ipc-message", (event) => {
  console.log(event);
});

document.getElementById("print-to-pdf").addEventListener("click", printToPDF);
document.getElementById("ipc").addEventListener("click", test);
document.getElementById("open-devtools").addEventListener("click", openDevTools);
