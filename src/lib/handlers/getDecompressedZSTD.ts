import * as fzstd from "fzstd";

export function getDecompressedZSTD(contents: Uint8Array) {
    return fzstd.decompress(contents);
}
