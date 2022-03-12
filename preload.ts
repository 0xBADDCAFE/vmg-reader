import { contextBridge, ipcRenderer } from "electron";
import { Message, VMG } from "./src/types";
import { readFile } from "fs/promises";
import { simpleParser, ParsedMail } from "mailparser";

const MARKER_OFFSET = "BEGIN:VBODY".length + 2;

contextBridge.exposeInMainWorld("electronAPI", {
  openVmg: async (): Promise<VMG> => {
    const filePathList: string[] = await ipcRenderer.invoke(
      "open-file-dialog",
      "Select VMG File"
    );
    const fileName = filePathList[0];
    const s = await readFile(fileName);

    const messages: Message[] = [];
    const skipped: ParsedMail[] = [];
    const bodyStrList: string[] = [];
    let offset = s.indexOf("BEGIN:VBODY") + MARKER_OFFSET;
    while (offset > MARKER_OFFSET) {
      const bodyStr = s.slice(offset, s.indexOf("END:VBODY", offset));
      // console.log(bodyStr);
      const parsed = await simpleParser(bodyStr);
      if (!parsed.from) {
        // SMS or other
        skipped.push(parsed);
      } else {
        // console.log(parsed);
        messages.push({
          id: crypto.randomUUID(),
          ...parsed,
        });
      }
      offset = s.indexOf("BEGIN:VBODY", offset) + MARKER_OFFSET;
    }
    console.log(messages);
    console.log("Skipped:");
    console.log(skipped);

    return { fileName, messages };
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
