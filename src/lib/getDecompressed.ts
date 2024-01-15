import * as fzstd from "fzstd";

export function getDecompressed(contents: Uint8Array) {
    return fzstd.decompress(contents);
}
