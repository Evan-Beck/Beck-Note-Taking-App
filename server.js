// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // for unique identifiers

// Initialize express app
const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, 'develop/public'))); // serve static files
app.use(express.json()); // for parsing application/json

// Serve the main index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'develop/public/index.html'));
});

// Serve the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'develop/public/notes.html'));
});

// API Route to get all notes
app.get('/api/notes', (req, res) => {
  console.log("/api/notes hit");
  fs.readFile('develop/db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading notes');
    }
    res.json(JSON.parse(data));
  });
});

// API Route to add a new note
app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() }; // add a unique id

  fs.readFile('develop/db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading notes');
      console.log(data);
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
