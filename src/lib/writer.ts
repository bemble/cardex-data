import path from "path";
import fs from "fs";

export class Writer {
  static getFilePath(filename: string) {
    return path.resolve(`${process.cwd()}/./data/${filename}.json`);
  }

  static write(data: any, filename: string) {
    const filePath = this.getFilePath(filename);
    if (!fs.existsSync(path.basename(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}
