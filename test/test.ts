import test from "ava";

const fn = () => "foo";

test("fn() returns foo", (t) => {
  t.is(fn(), "foo");
});

test("detected files", (t) => {
  // APKG is essentially just a ZIP file
  const expected = [
    "collection.anki2", // This the sqlite db for older versions?
    "collection.anki21", // This the actual db with all tables and data
    "0", // PNG image
    "1", // PNG image
    "2", // PNG image
    "3", // PNG image
    "4", // PNG image
    "media", // What is this??  is it related to images and scheduling???
  ];
  console.log("need to handle these");
  t.fail("to be implemented");
});
