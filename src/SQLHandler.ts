import initSqlJs, { Database } from "sql.js";

const ALL_NOTES_QUERY = "SELECT * FROM notes;";
const ALL_DECKS_QUERY = "SELECT * FROM col;";

import fs from "fs";

interface Deck {
  name: string;
}

export default class SQLHandler {
  db: Database | undefined;

  async load(collectionData: string | Uint8Array) {
    const SQL = await initSqlJs();
    const buffer = Buffer.from(collectionData);
    this.db = new SQL.Database(buffer);
  }

  notes() {
    const res = this.db!.exec(ALL_NOTES_QUERY);
    return res[0].values;
  }

  decks(): Deck[] {
    const res = this.db!.exec(ALL_DECKS_QUERY)[0];
    const decksColumn = res.columns.findIndex((c) => c == "decks");
    const decks = [];
    for (const col of res.values) {
      /* @ts-ignore */
      const deckJSON = JSON.parse(col[decksColumn]);
      for (const key of Object.keys(deckJSON)) {
        const deck = deckJSON[key];
        decks.push(deck);
      }
    }
    return decks;
  }
}
