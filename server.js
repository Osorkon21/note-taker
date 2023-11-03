// import necessary packages
const express = require('express');
const { v4: uuidv4 } = require("uuid");
const fs = require('fs');
const path = require("path");

// start express
const app = express();

// choose port for express to use later
const PORT = process.env.PORT || 3001;

// necessary for express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// necessary to serve what is in the public folder
app.use(express.static("public"));

// return notes.html
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "public/notes.html")));

// return database as a JSON
app.get("/api/notes", (req, res) => res.sendFile(path.join(__dirname, "db/db.json")));

// return index.html by default
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

// handle post routes
app.post("/api/notes", (req, res) => {

  // create new note to save to database
  const newNote = {
    title: req.body.title,
    text: req.body.text,

    // create unique ID for note
    id: uuidv4()
  };

  // read database file
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    let dbJSON = JSON.parse(data);

    // add new note to database
    dbJSON.push(newNote);

    // replace old database with new database containing new note
    fs.writeFile("./db/db.json", JSON.stringify(dbJSON), "utf-8", (err) => { if (err) console.error(err); });
  });

  // return new note
  res.send(newNote);
});

// delete notes from database
app.delete("/api/notes/:id", (req, res) => {

  // id of note to delete
  const id = req.params.id;

  // readFileSync is necessary here, as I ran into occasional errors with the async version
  const dbJSON = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));

  // remove note to delete from database JSON
  const filteredJSON = dbJSON.filter((note) => note.id !== id);

  // writeFileSync is necessary here, as I ran into occasional errors with the async version
  fs.writeFileSync("./db/db.json", JSON.stringify(filteredJSON), "utf-8");

  // return delete message (index.js does nothing with this, but res.send() must exist)
  res.send(`Deleted record from database where id = ${id}`);
});

// tell express to listen on a given port
app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
