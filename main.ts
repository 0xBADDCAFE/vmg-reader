import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const createWindow = async () => {
  const win = new BrowserWindow({
    width: isDev ? 1920 : 1280,
    height: 960,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    await win.loadURL("http://localhost:3000");
    // TODO: Load DevTools
    win.webContents.openDevTools();
  } else {
    win.loadFile("dist/index.html");
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
