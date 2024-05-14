const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Setting up Express for static files
app.use(express.static(__dirname));

// Serve the form HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to fetch list of events
app.get('/events', (req, res) => {
    fs.readFile('events.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading events file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(data);
    });
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { event_name, event_description, event_date, event_location, organizer_name, organizer_email } = req.body;

    // Validate form data
    if (!event_name || !event_description || !event_date || !event_location || !organizer_name || !organizer_email) {
        return res.send('Please fill all fields');
    }
    // Format event data
    const eventData = `${event_name} // ${event_description} // ${event_date} // ${event_location} // ${organizer_name} // ${organizer_email}\n`;

    // Append event data to a text file
    const file = path.join(__dirname, 'events.txt');
    fs.appendFile(file, eventData, (err) => {
        if (err) {
            return res.send('Error while saving event data');
        }
        res.redirect('/success.html');
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});