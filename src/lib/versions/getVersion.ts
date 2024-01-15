import {File} from "../zip/ZipHandler";

export function getVersion(latestVersion: string, files: File[]) {
    return files.find(f => f.name === latestVersion)
}
