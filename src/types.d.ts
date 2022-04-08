import { Attachment, ParsedMail } from "mailparser";

export interface IElectronAPI {
  openVmg: (
    onProgressUpdate?: (current: number, total: number) => void
  ) => Promise<VMG>;
  saveAttachments: (attachments: Attachment[] | undefined) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
  interface Crypto {
    randomUUID(): string;
  }
}

type Message = {
  id: string;
} & ParsedMail;

type VMG = {
  fileName: string;
  messages: Message[];
};

type SortKind = "AlphaAsc" | "AlphaDesc" | "DateAsc" | "DateDesc";
