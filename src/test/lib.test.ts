import path from "path";
import fs from "fs";

import {beforeAll, expect, test} from "vitest";

import SQLHandler from "../SQLHandler";
import {ZipHandler} from "../ZipHandler";
import {getInputFileAsZipHandler} from "./helpers/getInputFileAsZipHandler";
import {createDatabaseFrom} from "./helpers/createDatabaseFrom";

let zip: ZipHandler;
let db: SQLHandler;

beforeAll(async (t) => {
  const setupZIP = async () => {
    const filePath = path.join(__dirname, "artifacts/HTML TEST.apkg");
    const data = fs.readFileSync(filePath);
    const zip = new ZipHandler();
    await zip.build(data);
    return zip;
  };

  const setupDB = async (zip: ZipHandler) => {
    const collectionFilename = "collection.anki21";
    const collection = zip.files.find((f) => f.name === collectionFilename);
    const contents = collection!.contents;
    db = new SQLHandler();
    await db.load(contents);
    return db;
  };

  zip = await setupZIP();
  db = await setupDB(zip);
});

test("detected files", async (t) => {
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
});

test("reading sqlite files", async (t) => {
  expect(15).toStrictEqual(db.notes().length);
});

test("get deck name", async (t) => {
  const expected = "Default";
  const deck = db.decks()[0];

  expect(expected).toStrictEqual(deck.name);
});

test('get non-default deck name', async () => {
  const zipHandler = await getInputFileAsZipHandler("Capitals.apkg");
  const database = await createDatabaseFrom(zipHandler);
  expect(database.decks()[0].name).toEqual('Capitals');
})


/**
 * The way we get to the deck id is via cards.
 * From the notes we can find the correct cards
 * then access the deck id (did).
 */
test("get notes grouped by deck", async () => {
  const deck = db.decks()[0]
  const notes = db.notes();
  // const group = db.group([deck], notes);

  const expected = "&#x1F9E6; HTML test";
  // grouped && console.log(grouped?.notes[0].front);
  expect(expected).toStrictEqual(deck.name);

  if (notes) {
    expect(notes[0]).toBeTruthy();
  } else {
    throw new Error('No notes found for grouped test');
  }
});
