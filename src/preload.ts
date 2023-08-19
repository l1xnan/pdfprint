// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { WebviewTag, ipcRenderer, webContents } from "electron";

console.log("preload");

async function getHeadings() {
  const webview = document.querySelector("webview") as WebviewTag;

  webview.send("ping");
  // ipcRenderer.sendToHost("eventName", "eventData");
  const resultPromise = new Promise((resolve, reject) => {
    webContents
      .fromId(webview.getWebContentsId())
      .once("ipc-message", (event, channel, result) => {
        console.log(event, channel, result);
        if (channel === "pong1") {
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve(result);
          }
        }
      });
  });

  const data = await resultPromise;
  console.log(data);
  return data;
}

ipcRenderer.on("123", () => {
  console.log("123");
  getHeadings();
});
