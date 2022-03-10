export interface IElectronAPI {
  openVmg: () => Promise<VMG>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

type Message = {
  id: string;
  from: string;
  subject: string;
  date: Date;
  body: string;
};

type VMG = {
  fileName: string;
  messages: Message[];
};
