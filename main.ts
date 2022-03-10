import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.NODE_ENV === "development") {
    await win.loadURL("http://localhost:3000");
    // TODO: Load DevTools
    win.webContents.openDevTools();
  } else {
    win.loadFile("index.html");
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC Main

ipcMain.handle("open-file-dialog", async (ev, msg) => {
  var win = BrowserWindow.getFocusedWindow();
  if (win == null) return [];
  var result = await dialog.showOpenDialog(win, {
    filters: [{ name: "VMG Files", extensions: ["vmg"] }],
    properties: ["openFile", "multiSelections"],
  });
  if (result.canceled) {
    return [];
  }
  return result.filePaths;
});
