import {File} from "../../ZipHandler";

export function getVersion(latestVersion: string, files: File[]) {
    return files.find(f => f.name === latestVersion)
}
