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

import { getContents, showSaveDialog } from "./ipc";
import { addBookmarks, getHeadingPosition } from "./pdf";

console.log('👋 This message is being logged by "renderer.js", included via Vite');

export function createWebview(url: string) {
  const webview = document.createElement("webview") as WebviewTag;
  // webview.src = "https://pandoc.org/MANUAL.html";
  // webview.src = "https://pandoc.org/installing.html";
  webview.src = url;
  webview.setAttribute("style", "height:80vh;width:100vw");
  webview.nodeintegration = true;
  document.body.appendChild(webview);

  return webview;
}

export async function printToPDF() {
  const webview = document.querySelector("webview") as WebviewTag;

  const headings = await getHeadings(webview);
  console.log(headings);

  const data = await webview.printToPDF({});

  const filePath = (await showSaveDialog({}))?.filePath;

  const posistions = await getHeadingPosition(data);

  const stream = addBookmarks(data, headings, posistions);
  if (filePath) {
    fs.writeFile(filePath, stream.Stream, (error) => {
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

export async function openDevTools() {
  const webview = document.querySelector("webview") as WebviewTag;
  webview.openDevTools();
}

export async function testIPC() {
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

// const webview = createWebview();

// webview.addEventListener("ipc-message", (event) => {
//   console.log(event);
// });
