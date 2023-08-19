import { SaveDialogOptions, ipcRenderer } from "electron";

export async function showSaveDialog(options: SaveDialogOptions) {
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

export async function getContents() {
  const contents = await ipcRenderer.invoke("show-contents");
  console.log(contents)
  return contents.length;
}
