import path from 'path';
import fs from 'fs';

import SQLHandler from '../src/SQLHandler';
import { ZipHandler } from '../src/ZipHandler';
import { getCommentRange } from 'typescript';

let context;
beforeEach(async () => {
  const setupZIP = async () => {
    const filePath = path.join(__dirname, 'artifacts/HTML TEST.apkg');
    const data = fs.readFileSync(filePath);
    const zip = new ZipHandler();
    await zip.build(data);
    return zip;
  };

  const setupDB = async (zip: ZipHandler) => {
    const collectionFilename = 'collection.anki21';
    const collection = zip.files.find((f) => f.name === collectionFilename);
    const contents = collection!.contents;
    const db = new SQLHandler();
    await db.load(contents);
    return db;
  };

  const zip = await setupZIP();
  const db = await setupDB(zip);

  context = { zip: zip, db: db };
});

test('detected files', () => {
  // APKG is essentially just a ZIP file
  const expected = [
    '0', // PNG image
    '1', // PNG image
    '2', // PNG image
    '3', // PNG image
    '4', // PNG image
    'collection.anki2', // This the sqlite db for older versions?
    'collection.anki21', // This the actual db with all tables and data
    'media', // What is this??  is it related to images and scheduling???
  ];
  const actual = context.zip.fileNames;
  expect(actual).toEqual(expected);
});

test('reading sqlite files', async (t) => {
  t.deepEqual(15, t.context.db.notes().length);
});

test('get deck name', async (t) => {
  const expected = 'Default';
  const deck = t.context.db.decks()[0];

  t.deepEqual(expected, deck.name);
});

/**
 * The way we get to the deck id is via cards.
 * From the notes we can find the correct cards
 * then access the deck id (did).
 */
test('get notes grouped by deck', async (t) => {
  // &#x1F9E6; HTML test
  const grouped = t.context.db.group();

  const expected = '&#x1F9E6; HTML test';
  // grouped && console.log(grouped?.notes[0].front);
  t.deepEqual(expected, grouped[1].name);
  /* @ts-ignore */
  t.truthy(grouped[1].notes[0]);
});
