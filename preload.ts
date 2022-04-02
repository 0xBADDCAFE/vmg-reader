import { contextBridge, ipcRenderer } from "electron";
import { readFile } from "fs/promises";
import { ParsedMail, simpleParser } from "mailparser";
import { Message, VMG } from "./src/types";

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

    const skipped: ParsedMail[] = [];
    const bodyStrList: Buffer[] = [];

    await Promise.all(
      filePathList.map(async (filePath) => {
        const s = await readFile(filePath);
        let offset = s.indexOf("BEGIN:VBODY") + MARKER_OFFSET;
        while (offset > MARKER_OFFSET) {
          // First, get all messages to get to total to show progress
          const bodyBuffer = s.slice(offset, s.indexOf("END:VBODY", offset));

          bodyStrList.push(bodyBuffer);
          offset = s.indexOf("BEGIN:VBODY", offset) + MARKER_OFFSET;
        }
      })
    );

    const progressTotal = bodyStrList.length;
    let progressCurrent = 0;
    const tId = setInterval(() => {
      onProgressUpdate?.(progressCurrent, progressTotal);
      if (progressCurrent === progressTotal) clearInterval(tId);
    }, 100);
    // Parse with show progress
    const messages = [
      ...new Map<string, Message>(
        (await Promise.all(
          bodyStrList.map(async (el) => {
            const parsed = await simpleParser(el);
            const id = `${parsed.date.getTime()}\n${parsed.subject}\n${
              parsed.html || parsed.textAsHtml
            }`;
            progressCurrent++;
            return [id, { id, ...parsed }];
          })
        )) as [string, Message][]
      ).values(),
    ].filter((parsed) => {
      const succeeded = parsed.from;
      if (!succeeded) {
        // SMS or other
        skipped.push(parsed);
      }
      return succeeded;
    });
    console.log("uniqued");

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
