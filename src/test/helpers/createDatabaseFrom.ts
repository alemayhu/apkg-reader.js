import * as fzstd from 'fzstd';

import {ZipHandler, File} from "../../ZipHandler";
import SQLHandler from "../../SQLHandler";


const latestVersion = "collection.anki21b";
const oldVersion = "collection.anki2";
const modernVersion = "collection.anki21"

function getVersion(latestVersion: string, files: File[]) {
    return files.find(f => f.name === latestVersion)
}

const isLatestVersion = (v: string) => v === latestVersion;

function getDecompressed(contents: Uint8Array) {
    return fzstd.decompress(contents);
}

export async function createDatabaseFrom(zip: ZipHandler) {
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
