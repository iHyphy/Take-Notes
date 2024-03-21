const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

module.exports = function(app) {
    // Serve the homepage
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Serve the notes page
    app.get('/notes', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'notes.html'));
    });

    // API Route: Get all notes
    app.get('/api/notes', (req, res) => {
        fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading notes data.');
            }
            try {
                const notes = JSON.parse(data);
                res.json(notes);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                return res.status(500).send('Error parsing notes data.');
            }
        });
    });

    // API Route: Create a new note
    app.post('/api/notes', (req, res) => {
        fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading notes data.');
            }
            let notes;
            try {
                notes = JSON.parse(data);
                if (!Array.isArray(notes)) {
                    throw new Error('Notes data is not an array');
                }
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                return res.status(500).send('Error parsing notes data.');
            }
            const newNote = { ...req.body, id: uuidv4() };
            notes.push(newNote);
            fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    return res.status(500).send('Error saving new note.');
                }
                res.json(newNote);
            });
        });
    });

    // API Route: Delete a note by id
    app.delete('/api/notes/:id', (req, res) => {
        fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading notes data.');
            }
            let notes;
            try {
                notes = JSON.parse(data);
                if (!Array.isArray(notes)) {
                    throw new Error('Notes data is not an array');
                }
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                return res.status(500).send('Error parsing notes data.');
            }
            notes = notes.filter(note => note.id !== req.params.id);
            fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    return res.status(500).send('Error deleting note.');
                }
                res.json({ message: 'Note deleted successfully.' });
            });
        });
    });
};
