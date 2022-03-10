import { contextBridge, ipcRenderer } from "electron";
import { VMG } from "./src/types";
import { TextDecoder } from "util";
import { readFile } from "fs/promises";

contextBridge.exposeInMainWorld("electronAPI", {
  openVmg: async (): Promise<VMG> => {
    const filePathList: string[] = await ipcRenderer.invoke(
      "open-file-dialog",
      "Select VMG File"
    );
    console.log(filePathList);
    const d = new TextDecoder("sjis");
    const s = d.decode(await readFile(filePathList[0]));
    console.log(s);

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
