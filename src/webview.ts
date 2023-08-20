import {} from "pagedjs/dist/paged.polyfill";
import { contextBridge, ipcRenderer } from "electron";

// import { Previewer } from "pagedjs";
// const paged = new Previewer();
// const flow = paged
//   .preview(DOMContent, ["path/to/css/file.css"], document.body)
//   .then((flow) => {
//     console.log("Rendered", flow.total, "pages.");
//   });

// eslint-disable-next-line import/no-unresolved
import printCSS from "./print.css";
import { getHeadingTree } from "./utils";
console.log("css", printCSS);

console.log("webview preload");

window.addEventListener("DOMContentLoaded", () => {
  // 在 DOM 加载完成后执行的代码
  console.log("DOM 加载完成");
  createPrintCSS();
  modifyHeaders();
});

function createPrintCSS() {
  const styleTag = document.createElement("style");
  styleTag.id = "some-id";
  styleTag.innerHTML = printCSS;
  document.head.appendChild(styleTag);
  console.log("执行自定义函数");
}

function modifyHeaders() {
  const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headers.forEach((heading, i) => {
    const link = document.createElement("a") as HTMLAnchorElement;
    link.href = `af://n${i}`;
    link.className = "md-print-anchor";
    heading.appendChild(link);
  });
}

// 定义可以被渲染进程调用的 API
export const api = {
  sendToMain: (message: string) => {
    ipcRenderer.send("message-to-main", message);
  },
  receiveFromMain: (callback: (message: string) => void) => {
    ipcRenderer.on("message-from-main", (event, message) => {
      callback(message);
    });
  },
  getHtml: () => {
    return document.documentElement.outerHTML;
  },
  getHeadings: () => {
    const data: any = {};
    document.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((item: HTMLElement) => {
      const link = item.querySelector("a.md-print-anchor") as HTMLLinkElement;
      const regexMatch = /^af:\/\/(.+)$/.exec(link?.href ?? "");
      if (regexMatch) {
        data[regexMatch[1]] = [item.tagName, item.innerText];
      }
    });
    return data;
  },
  getHeadingTree,
};

// 将 API 暴露给渲染进程
contextBridge.exposeInMainWorld("$api", api);

// 监听来自渲染进程的事件
ipcRenderer.on("eventName", () => {
  // 执行必要的操作并获取结果
  const result = "结果数据";
  console.log(123);

  // 将结果发送给渲染进程
  ipcRenderer.send("resultEventName", result);
});

// In guest page.
ipcRenderer.on("ping", () => {
  const data: string[] = [];
  document.querySelectorAll("h1").forEach((item) => {
    data.push(item.innerText);
  });
  ipcRenderer.sendToHost("pong1", data);
  ipcRenderer.send("pong2", data);
  // ipcRenderer.
});
