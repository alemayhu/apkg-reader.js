import path from "path";
import fs from "fs";

import anyTest, { TestInterface } from "ava";

import SQLHandler from "../src/SQLHandler";
import { ZipHandler } from "../src/ZipHandler";

// TODO: add the db stuff to the interface
const test = anyTest as TestInterface<{ zip: ZipHandler; db: SQLHandler }>;

test.before(async (t) => {
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
    const db = new SQLHandler();
    await db.load(contents);
    return db;
  };

  const zip = await setupZIP();
  const db = await setupDB(zip);

  t.context = { zip: zip, db: db };
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
  const actual = t.context.zip.fileNames;
  t.deepEqual(expected, actual);
});

test("reading sqlite files", async (t) => {
  t.deepEqual(15, t.context.db.notes().length);
});
