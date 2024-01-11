import {ZipHandler, File} from "../../ZipHandler";
import SQLHandler from "../../SQLHandler";

const oldVersion = "collection.anki2";
const modernVersion = "collection.anki21"

function getVersion(latestVersion: string, files: File[]) {
    return files.find(f => f.name === latestVersion)
}

export async function createDatabaseFrom(zip: ZipHandler) {
    let collection = getVersion(modernVersion, zip.files) || getVersion(oldVersion, zip.files);

    if (!collection) {
        return undefined;
    }

    const contents = collection.contents;
    const db = new SQLHandler();
    await db.load(contents);
    return db;
}
