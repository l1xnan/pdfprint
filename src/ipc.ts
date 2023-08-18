import { dialog, ipcMain } from "electron";

export function setupIPC() {
  ipcMain.handle("show-save-dialog", async (event, options) => {
    const result = await dialog.showSaveDialog(options);
    return result;
  });
}

