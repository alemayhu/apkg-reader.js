import path from "path";
import fs from "fs";
import {ZipHandler} from "../../lib/handlers/ZipHandler";

export async function getInputFileAsZipHandler(apkg: string) {
    const filePath = path.join(__dirname, `../artifacts/${apkg}`);
    const data = fs.readFileSync(filePath);
    const zip = new ZipHandler();
    await zip.extractFilesInPlace(data);
    return zip;
}
