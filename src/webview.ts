import {} from "pagedjs/dist/paged.polyfill";

// import { Previewer } from "pagedjs";
// const paged = new Previewer();
// const flow = paged
//   .preview(DOMContent, ["path/to/css/file.css"], document.body)
//   .then((flow) => {
//     console.log("Rendered", flow.total, "pages.");
//   });
// eslint-disable-next-line import/no-unresolved
import printCSS from "./print.css";
console.log("css", printCSS);

console.log("webview preload");

window.addEventListener("DOMContentLoaded", () => {
  // 在 DOM 加载完成后执行的代码
  console.log("DOM 加载完成");
  myFunction();
});

function myFunction() {
  const styleTag = document.createElement("style");
  styleTag.id = "some-id";
  styleTag.innerHTML = printCSS;
  document.head.appendChild(styleTag);
  console.log("执行自定义函数");
}
