import initSqlJs, { Database } from "sql.js";

const ALL_NOTES_QUERY = "SELECT * FROM notes;";

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
}
