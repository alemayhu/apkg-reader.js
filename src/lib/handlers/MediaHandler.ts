export class MediaHandler {
    private media: { [key: string]: string };

    constructor(mediaFile: string) {
        this.media = JSON.parse(mediaFile);
    }

    getFiles() {
        return this.media;
    }
}
