import { contextBridge, ipcRenderer } from "electron";
import { readFile } from "fs/promises";
import { ParsedMail, simpleParser } from "mailparser";
import { VMG } from "./src/types";

const MARKER_OFFSET = "BEGIN:VBODY".length + 2;

contextBridge.exposeInMainWorld("electronAPI", {
  openVmg: async (
    onProgressUpdate?: (current: number, total: number) => void
  ): Promise<VMG> => {
    const filePathList: string[] = await ipcRenderer.invoke(
      "open-file-dialog",
      "Select VMG File"
    );
    if (filePathList.length == 0) {
      return { fileName: "", messages: [] };
    }
    const fileName = filePathList[0];
    const s = await readFile(fileName);

    const skipped: ParsedMail[] = [];
    const bodyStrList: Buffer[] = [];
    let offset = s.indexOf("BEGIN:VBODY") + MARKER_OFFSET;
    while (offset > MARKER_OFFSET) {
      // First, get all messages to get to total to show progress
      const bodyStr = s.slice(offset, s.indexOf("END:VBODY", offset));
      bodyStrList.push(bodyStr);
      offset = s.indexOf("BEGIN:VBODY", offset) + MARKER_OFFSET;
    }
    const progressTotal = bodyStrList.length;
    let progressCurrent = 0;
    onProgressUpdate?.(progressCurrent, progressTotal);
    // Parse with show progress
    const messages = (
      await Promise.all(
        bodyStrList.map(async (el) => {
          const parsed = await simpleParser(el);
          onProgressUpdate?.(++progressCurrent, progressTotal);
          return { id: crypto.randomUUID(), ...parsed };
        })
      )
    ).filter((parsed) => {
      const succeeded = parsed.from;
      if (!succeeded) {
        // SMS or other
        skipped.push(parsed);
      }
      return succeeded;
    });

    messages.sort((l, r) => l.date.getTime() - r.date.getTime());
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
