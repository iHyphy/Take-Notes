const express = require('express');
const fs = require('fs');
const path = require('path');
// No need to require uuid here if it's only used in routes.js
// const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

// Include your routes
require('./routes')(app); // This is where you add it

app.listen(PORT, () => {
    console.log(`Note Taker app is listening at http://localhost:${PORT}`);
});
