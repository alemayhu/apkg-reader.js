import path from "path";
import fs from "fs";

import anyTest, { TestInterface } from "ava";

import { ZipHandler } from "../src/ZipHandler";

const test = anyTest as TestInterface<{ zip: ZipHandler }>;

test.before(async (t) => {
  const filePath = path.join(__dirname, "artifacts/HTML TEST.apkg");
  const data = fs.readFileSync(filePath);
  const zip = new ZipHandler();
  await zip.build(data);
  t.context = { zip: zip };
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
