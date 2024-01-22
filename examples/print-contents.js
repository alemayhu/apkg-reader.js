const path = require('path');
const fs  = require("fs");

const lib = require('../dist/index.js');
const {readDatabaseFrom, ZipHandler} = lib;

async function  main() {
    const filePath = path.join(__dirname, '../src/test/artifacts/HTML TEST.apkg')
    const data = fs.readFileSync(filePath)
    const zip = new ZipHandler();
    await zip.extractFilesInPlace(data)
    const db = await readDatabaseFrom(zip)
    console.log('-', db?.decks()[0].name)
    console.log('--', db?.notes().map(note => '-- '+ note.front).join('\n'))
}

main()
