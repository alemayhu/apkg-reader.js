import {ZipHandler} from "../../ZipHandler";
import SQLHandler from "../../SQLHandler";

export async function createDatabaseFrom(zip: ZipHandler) {
    const collectionFilename = "collection.anki21";
    const collection = zip.files.find((f) => f.name === collectionFilename);
    const contents = collection!.contents;
    const db = new SQLHandler();
    await db.load(contents);
    return db;
}
