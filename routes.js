const express = require('express');
const fs = require('fs');

const router = express.Router();


// New endpoint to fetch event capacity
router.get('/eventCapacity', (req, res) => {
    const eventId = req.query.eventId;

    // Read the contents of signup.txt
    fs.readFile('signup.txt', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading signup.txt:", err);
            res.status(500).send("Error reading signup.txt");
            return;
        }

        // Split the data into lines
        const lines = data.trim().split('\n');

        // Find the line corresponding to the event ID
        let eventLine;
        for (const line of lines) {
            const [event, capacity, ...participants] = line.split(' // ');
            if (event === eventId) {
                eventLine = { capacity: parseInt(capacity), participants };
                break;
            }
        }

        // Check if the event line was found
        if (!eventLine) {
            console.error("Event ID not found:", eventId);
            res.status(404).send("Event ID not found");
            return;
        }

        res.json({ capacity: eventLine.capacity, participants: eventLine.participants });
    });
});

// Handle POST requests to /signup
router.post('/signup', (req, res) => {
    const { eventId, username } = req.body;
    console.log(req.body)
    if (!eventId || !username) {
        return res.status(400).send('Invalid data');
    }

    // Read the signup.txt file
    fs.readFile('signup.txt', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading signup.txt:", err);
            return res.status(500).send('Internal server error');
        }

        // Split the data into an array of lines
        const lines = data.split('\n');

        // Find the line that corresponds to the eventId
        const index = lines.findIndex(line => {
            return line.startsWith(eventId);
        });

        if (index !== -1) {
            // Append the username to the found line
            lines[index] += ' // ' + username;

            // Join the lines back into a string
            const updatedData = lines.join('\n');

            // Write the updated data back to the file
            fs.writeFile('signup.txt', updatedData, 'utf8', (err) => {
                if (err) {
                    console.error("Error writing to signup.txt:", err);
                    return res.status(500).send('Internal server error');
                }
                console.log("User signed up successfully for event:", eventId);
                res.sendStatus(200);
            });
        } else {
            console.error("Event not found:", eventId);
            return res.status(404).send('Event not found');
        }
    });
});



module.exports = router;