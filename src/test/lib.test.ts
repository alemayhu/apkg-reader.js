import path from "path";
import fs from "fs";

import {expect, test} from "vitest";

import {ZipHandler} from "../lib/handlers/ZipHandler";
import {readDatabaseFrom} from "../lib/readDatabaseFrom";
import {MediaHandler} from "../lib/handlers/MediaHandler";

async function getInputFileAsZipHandler(apkg: string) {
  const filePath = path.join(__dirname, `./artifacts/${apkg}`);
  const data = fs.readFileSync(filePath);
  const zip = new ZipHandler();
  await zip.extractFilesInPlace(data);
  return zip;
}


test("detected files", async () => {
  let zip = await getInputFileAsZipHandler("HTML TEST.apkg");

  // APKG is essentially just a ZIP file
  const expected = [
    "0", // PNG image
    "1", // PNG image
    "2", // PNG image
    "3", // PNG image
    "4", // PNG image
    "collection.anki2", // This the sqlite db for older versions?
    "collection.anki21", // This the actual db with all tables and data
    "media", // What is this??  is it related to images and scheduling???
  ];
  const actual = zip.fileNames;
  expect(expected).toStrictEqual(actual);
  expect(expected).toStrictEqual(zip.getFileNames());
});

test("reading sqlite files", async (t) => {
  let zip = await getInputFileAsZipHandler("HTML TEST.apkg");
  let db = await readDatabaseFrom(await zip);
  let notes = db?.notes()
  expect(15).toStrictEqual(db?.notes().length);
});

test("get deck name", async (t) => {
  let zip = await getInputFileAsZipHandler("HTML TEST.apkg");
  let db = await readDatabaseFrom(await zip);
  const expected = "Default";
  const decks = db?.decks();
  if (decks) {
    expect(expected).toStrictEqual(decks[0]?.name);
    expect(decks[1].name).toEqual("&#x1F9E6; HTML test");
  } else {
    throw new Error("Did not load decks");
  }
});

test('get non-default deck name', async () => {
  const zipHandler = await getInputFileAsZipHandler("Capitals.apkg");
  const database = await readDatabaseFrom(zipHandler);
  const decks = database?.decks({
    useZSTD: true
  });

  if (decks) {
    expect(decks[1]?.name).toEqual('Capitals');
  } else {
    throw new Error("Missing deck: Capitals")
  }
})


/**
 * The way we get to the deck id is via cards.
 * From the notes we can find the correct cards
 * then access the deck id (did).
 */
test("get notes grouped by deck", async () => {
  let zip = await getInputFileAsZipHandler("HTML TEST.apkg");
  let db = await readDatabaseFrom(await zip);
  const deck = db?.decks()[0]
  const notes = db?.notes();
  // const group = db.group([deck], notes);

  const expected = "Default";
  // grouped && console.log(grouped?.notes[0].front);
  expect(expected).toStrictEqual(deck?.name);

  if (notes) {
    expect(notes[0]).toBeTruthy();
  } else {
    throw new Error('No notes found for grouped test');
  }
});

test("get media files", async () => {
  let zip = await getInputFileAsZipHandler("HTML TEST.apkg");
  const mediaFile = await zip.getMediaFile();
  const contents = (mediaFile?.contents)?.toString();
  const media = new MediaHandler(contents!);

  expect(media.getFiles()).toEqual(
      {
        "0": "6607631571149c09609b248b9e353752f84d1b74.png",
        "1": "d56fb9f3d4cf60abbcf66603225d80a4fe6ab4aa.png",
        "2": "ffdcdfdcdeaec827d7ab7ba0d82d6c5b0ccaca41.png",
        "3": "9f81241e831db14361b054623138658a9d49d751.jpg",
        "4": "d951457b1d3277a1ce3ffc3e52bf55901b8997d7.jpg"
      }
  )
})
