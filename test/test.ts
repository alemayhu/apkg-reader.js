import path from "path";
import fs from "fs";

import test from "ava";

import { ZipHandler } from "../src/ZipHandler";

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
  // TODO: load the data in setup, should not really change
  const filePath = path.join(__dirname, "artifacts/HTML TEST.apkg");
  const data = fs.readFileSync(filePath);
  const zip = new ZipHandler();
  await zip.build(data);
  const actual = zip.fileNames;
  t.deepEqual(expected, actual);
});
