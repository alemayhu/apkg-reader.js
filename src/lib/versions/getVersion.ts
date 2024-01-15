import {File} from "../handlers/ZipHandler";

export function getVersion(latestVersion: string, files: File[]) {
    return files.find(f => f.name === latestVersion)
}
