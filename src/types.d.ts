export interface IElectronAPI {
  showOpenFileDialog: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
