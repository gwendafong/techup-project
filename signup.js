const express = require('express');
const fs = require('fs');

const router = express.Router();

// Handle POST requests to /signup
router.post('/', (req, res) => {
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