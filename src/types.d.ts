import { ParsedMail } from "mailparser";

export interface IElectronAPI {
  openVmg: () => Promise<VMG>;
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
