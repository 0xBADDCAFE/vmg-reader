import { contextBridge, ipcRenderer } from "electron";
import { VMG } from "./src/types";

contextBridge.exposeInMainWorld("electronAPI", {
  openVmg: async (): Promise<VMG> => {
    // ipcRenderer.invoke("open-file-dialog", "Select VMG File")

    const from = "foo@bar.baz";
    const date = new Date("Wed, 9 Apr 2008 16:30:00 +0900");
    return {
      fileName: "",
      messages: [
        {
          id: `${date.getTime()}_${from}`,
          from,
          subject: "This is email title",
          date,
          body: "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。",
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
