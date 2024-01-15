import initSqlJs, { Database, SqlValue } from "sql.js";

const ALL_NOTES_QUERY = "SELECT * FROM notes;";
const deckIdFromNoteId = (id: number) => {
  return `SELECT did FROM cards WHERE nid = ${id};`;
};

interface Note {
  id: number | string | Uint8Array | null;
  front: string;
  back: string;
}

interface Deck {
  id: number;
  name: string;
  notes?: Note[];
}

interface DatabaseOptions {
  useZSTD: boolean;
}

export default class SQLHandler {
  db: Database | undefined;

  async load(collectionData: string | Uint8Array) {
    const SQL = await initSqlJs();
    const buffer = Buffer.from(collectionData);
    this.db = new SQL.Database(buffer);
  }

  notes(): Note[] {
    const res = this.db!.exec(ALL_NOTES_QUERY)[0];
    const _notes = [];
    const idColumn = res.columns.findIndex((c) => c == "id");
    const sfldColumn = res.columns.findIndex((c) => c == "sfld");
    const fldsColumn = res.columns.findIndex((c) => c == "flds");
    for (const col of res.values) {
      _notes.push({
        id: col[idColumn],
        front: col[fldsColumn]?.toString() || "",
        back: col[sfldColumn]?.toString() || "",
      });
    }
    return _notes;
  }

  decks(options?: DatabaseOptions): Deck[] {
    if (options?.useZSTD) {
      return this.getLatestDecks();
    }
    return this.getModernOrOldDecks();
  }

  private getModernOrOldDecks() {
    const ALL_DECKS_QUERY = "SELECT * FROM col;";
    const res = this.db!.exec(ALL_DECKS_QUERY)[0];
    const decksColumn = res.columns.findIndex((c) => c == "decks");
    const decks = [];
    for (const col of res.values) {
      const deckJSON = JSON.parse(<string>col[decksColumn]);
      for (const key of Object.keys(deckJSON)) {
        const deck = deckJSON[key];
        decks.push(deck);
      }
    }
    return decks;
  }

  // group(notes?: Note[], decks?: Deck[]): Deck[] {
  //   const _notes = notes || this.notes();
  //   const _decks = decks || this.decks();
  //
  //   for (const n of _notes) {
  //     const deckId = this.db!.exec(deckIdFromNoteId(n.id))[0].values[0][0];
  //     const deck = _decks.find((d) => d.id === deckId);
  //     if (deck) {
  //       deck.notes ||= [];
  //       deck.notes.push(n);
  //     }
  //   }
  // }
  private getLatestDecks() {
    const ALL_DECKS_QUERY = "SELECT * FROM decks;";
    const res = this.db!.exec(ALL_DECKS_QUERY)[0];
    const decks : Deck[] = [];
    for (const col of res.values) {
      decks.push(<Deck>{id: col[0], name: col[1]});
    }
    return decks;
  }
}
