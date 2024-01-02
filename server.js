// Express const for HTTP requests, path is for handling the file paths, file system const reads and writes the files, and the app creates the express application.
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // For unique identifiers - the idv4 is version 4 of UUID and generates pseudo-random numbers as the ID for each saved note. 
const app = express();

// Middlewares - line 9 serves static files from develop/public directory and 10 will automatically parse those requests as JSON.
app.use(express.static(path.join(__dirname, 'develop/public'))); 
app.use(express.json()); 

// Serves as the main index.html file, line 18 is the main notes.html file. The res.sendFile(path) sends specific files to the user, like the loading page or saved notes. 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'develop/public/index.html'));
});


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'develop/public/notes.html'));
});

// API Route to get all notes (READ). The readfile generates a 500 error in the console if files cannot be read. If the route is successful, then the data will be parsed as a JSON string and sent as a response. 
app.get('/api/notes', (req, res) => {
  fs.readFile('develop/db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading notes');
    }
    res.json(JSON.parse(data));
  });
});

// API Route to add a new note (this writes/creates the note). The const newnote creates a note object from the request body and is assigned a unique ID from uuidv4. Readfile then adds the new note and saves the updated list to db.json in the file path.
app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };

  fs.readFile('develop/db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading notes');
    }
    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('develop/db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error saving note');
      }
      res.json(newNote);
    });
  });
});

// API Route to delete a note by id. Readfile reads the existing notes, then removes the note the user selects and updates that to the db.json. 
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile('develop/db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading notes');
    }

    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);

    fs.writeFile('develop/db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error saving notes');
      }
      res.json({ msg: 'Note deleted', id: noteId });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

// ADDITIONAL COMMENTS - UTF8 makes sure that node.js reads fs.readfile as a string and be parsed as JSON. 