const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const signupRouter = require('./signup'); //to import signup functionality
const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    const { event_name, event_description, event_date, event_time, event_location, organizer_name, organizer_email, max_capacity } = req.body;

    // Validate form data
    if (!event_name || !event_description || !event_date || !event_time || !event_location || !organizer_name || !organizer_email) {
        return res.send('Please fill all fields');
    }

    // Set max capacity to 1000 if not provided
    const capacity = max_capacity ? max_capacity : 1000;

    // Generate a unique event ID
    const eventId = uuidv4();

    // Format event data
    const eventData = `${eventId} // ${event_name} // ${event_description} // ${event_date} // ${event_time} // ${event_location} // ${organizer_name} // ${organizer_email} // ${capacity}\n`;

    // Append event data to a text file
    const file = path.join(__dirname, 'events.txt');
    fs.appendFile(file, eventData, (err) => {
        if (err) {
            return res.send('Error while saving event data');
        }
        
    });
    
    // Create signup.txt if not exists and append event ID and max capacity
    const signupFile = path.join(__dirname, 'signup.txt');
    fs.appendFileSync(signupFile, `${eventId} // ${capacity}\n`);
    res.redirect('/success.html');
});

// Use the signup router
app.use('/signup', signupRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});