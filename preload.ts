import { contextBridge, ipcRenderer } from "electron";
import { VMG } from "./src/types";

contextBridge.exposeInMainWorld("electronAPI", {
  openVmg: async (): Promise<VMG> => {
    // ipcRenderer.invoke("open-file-dialog", "Select VMG File")
    return {
      fileName: "",
      messages: [
        {
          from: "",
          subject: "",
          date: new Date("Wed, 9 Apr 2008 16:30:00 +0900"),
          body: "",
        },
      ],
    };
  },
});

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
