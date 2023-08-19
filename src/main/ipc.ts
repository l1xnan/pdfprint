import { dialog, ipcMain, webContents } from "electron";

export function setupIPC() {
  ipcMain.handle("show-save-dialog", async (event, options) => {
    const result = await dialog.showSaveDialog(options);
    return result;
  });

  ipcMain.handle("show-contents", async () => {
    const result = webContents.getAllWebContents();
    console.log(result, result.length);

    return  result.length;
  });
}
