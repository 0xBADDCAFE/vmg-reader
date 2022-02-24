export interface IElectronAPI {
  showOpenFileDialog: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

type VMG = {
  fileName: string;
  messages: [
    {
      from: string;
      subject: string;
      date: Date;
      body: string;
    }
  ];
};
