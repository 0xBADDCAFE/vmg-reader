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
    if (filePathList.length == 0) return { fileName: "", messages: [] };

    const fileName = getFileNameLabel(filePathList);

    const decoder = new TextDecoder("utf-8");
    const skipped: ParsedMail[] = [];
    const bodyStrMap: Map<String, Buffer> = new Map();

    await Promise.all(
      filePathList.map(async (filePath) => {
        const s = await readFile(filePath);
        let offset = s.indexOf("BEGIN:VBODY") + MARKER_OFFSET;
        while (offset > MARKER_OFFSET) {
          // First, get all messages to get to total to show progress
          const bodyBuffer = s.slice(offset, s.indexOf("END:VBODY", offset));

          bodyStrMap.set(decoder.decode(bodyBuffer), bodyBuffer);
          offset = s.indexOf("BEGIN:VBODY", offset) + MARKER_OFFSET;
        }
      })
    );

    const progressTotal = bodyStrMap.size;
    let progressCurrent = 0;
    const tId = setInterval(() => {
      onProgressUpdate?.(progressCurrent, progressTotal);
      if (progressCurrent === progressTotal) clearInterval(tId);
    }, 100);
    // Parse with show progress
    const messages = (
      await Promise.all(
        [...bodyStrMap.values()].map(async (el) => {
          const parsed = await simpleParser(el);
          progressCurrent++;
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

    // messages.sort((l, r) => l.date.getTime() - r.date.getTime());
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

const getFileNameLabel = (filePathList: string[]) => {
  switch (filePathList.length) {
    case 0:
      return "";
    case 1:
      return filePathList[0];
    default:
      return `${filePathList[0]} and ${filePathList.slice(1).length} files`;
  }
};
