// uuid is the npm package that gives everything a unique ID

//   ```
// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column
// ```

// The following API routes should be created:

// You haven’t learned how to handle DELETE requests, but this application offers that functionality on the front end.As a bonus, try to add the DELETE route to the application using the following guideline:

//   * `DELETE /api/notes/:id` should receive a query parameter that contains the id of a note to delete.To delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.

const express = require('express');
const { v4: uuidv4 } = require("uuid");
const fs = require('fs');
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "public/notes.html")));

app.get("/api/notes", (req, res) => res.sendFile(path.join(__dirname, "db/db.json")));

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

app.post("/api/notes", (req, res) => {
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4()
  };

  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    let dbJSON = JSON.parse(data);
    dbJSON.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(dbJSON), "utf-8", (err) => { if (err) console.error(err); });
  });

  res.send(newNote);
});

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
