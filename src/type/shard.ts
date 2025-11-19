export interface TemplateData {
  modelName: string;
  tableName: string;
  fileName: string;
}

export interface IndexedFile {
  type: string;
  dir: string;
  file: string;
  content: string;
  shouldIndex: boolean;
}
[];

export interface GenerateFileData {
  modelName: string;
  tableName: string;
  fileName: string;
  baseFileName: string;
  srcDir: string;
  start: boolean;
  updateState: (data: boolean) => void;
}
