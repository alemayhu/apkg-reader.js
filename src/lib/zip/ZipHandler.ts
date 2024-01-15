import JSZip from "jszip";

export interface File {
  name: string;
  contents: string | Uint8Array;
}

class ZipHandler {
  fileNames: string[];
  files: File[];

  constructor() {
    this.fileNames = [];
    this.files = [];
  }

  async extractFilesInPlace(zipData: Buffer) {
    const loadedZip = await JSZip.loadAsync(zipData);
    this.fileNames = Object.keys(loadedZip.files);
    this.fileNames = this.fileNames.filter((f) => !f.endsWith("/"));
    this.files = [];

    for (const name of this.fileNames) {
      let contents;
      if (name.match(/.(md|html)$/)) {
        contents = await loadedZip.files[name].async("text");
      } else {
        contents = await loadedZip.files[name].async("uint8array");
      }
      if (!contents) {
        throw new Error(`Empty file ${name}`);
      }
      this.files.push({ name, contents });
    }
  }

  getFileNames() {
    return this.fileNames;
  }
}

export { ZipHandler };
