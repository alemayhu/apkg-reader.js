import {ZipHandler} from "./zip/ZipHandler";
import SQLHandler from "../SQLHandler";
import {getVersion} from "./versions/getVersion";
import {isLatestVersion} from "./versions/isLatestVersion";
import {latestVersion, modernVersion, oldVersion} from "./versions/constants";
import {getDecompressed} from "./getDecompressed";


export async function readDatabaseFrom(zip: ZipHandler) {
    let collection = getVersion(latestVersion, zip.files) || getVersion(modernVersion, zip.files) || getVersion(oldVersion, zip.files);

    if (!collection) {
        return undefined;
    }

    const contents =
        isLatestVersion(collection.name) ? getDecompressed(collection.contents as Uint8Array) : collection.contents;
    const db = new SQLHandler();
    await db.load(contents);
    return db;
}
