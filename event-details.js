// Function to retrieve eventId from URL
function getEventIdFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('eventId');
}

// Function to retrieve event details by eventId
function getEventDetails(eventId) {
    fetch('/events.txt')
    .then(response => response.text())
    .then(data => {
        // Split the data by newline to get individual events
        const events = data.split('\n').filter(event => event.trim() !== '');
        
        // Find the event with matching eventId
        const event = events.find(event => {
            const [currentEventId] = event.split(' // ');
            return currentEventId === eventId;
        });

        if (event) {
            // If event found, parse its details
            const [foundEventId, eventName, eventDescription, eventDate, eventTime, eventLocation, eventOrganiser, eventOrgEmail, maxCapacity] = event.split(' // ');
            const eventDetails = {
                id: foundEventId,
                name: eventName,
                description: eventDescription,
                date: new Date(eventDate),
                time: eventTime,
                location: eventLocation,
                organiser: eventOrganiser,
                orgEmail: eventOrgEmail,
                maxCapacity: maxCapacity
            };
            
            // Populate the table with event details
            const tableBody = document.getElementById('eventDetails');
            const addRow = (label, value) => {
                const row = document.createElement('tr');
                const labelCell = document.createElement('td');
                const valueCell = document.createElement('td');
                
                labelCell.textContent = label;
                valueCell.textContent = value;

                row.appendChild(labelCell);
                row.appendChild(valueCell);
                tableBody.appendChild(row);
            };

            addRow('Name:', eventDetails.name);
            addRow('Description:', eventDetails.description);
            addRow('Date:', eventDetails.date.toLocaleDateString('en-US'));
            addRow('Time:', eventDetails.time);
            addRow('Location:', eventDetails.location);
            addRow('Organiser:', eventDetails.organiser);
            addRow("Organiser's Email:", eventDetails.orgEmail);
            
            // Check if max capacity is reached
            
            maxCapacityReached(eventId)
                .then(isReached => {
                    if (isReached) { 
                        addRow('Status:', 'Max capacity reached');
                    } else {
                        // Display sign-up button
                        const signUpButton = document.createElement('button');
                        signUpButton.textContent = 'Sign up';
                        signUpButton.className = 'signup-button';
                        signUpButton.onclick = () => getUserName();
                        const actionCell = document.createElement('td');
                        actionCell.appendChild(signUpButton);
                        const actionRow = document.createElement('tr');
                        actionRow.appendChild(document.createElement('td')); // Empty cell for alignment
                        actionRow.appendChild(actionCell);
                        tableBody.appendChild(actionRow);
                    }
                })

        } else {
            console.log("Event not found");
        }
    })
    .catch(error => console.error('Error retrieving event details:', error));
}

function maxCapacityReached(eventId) {
    return new Promise((resolve, reject) => {
        fetch('/eventCapacity?eventId=' + eventId)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch event capacity: ' + response.statusText);
                }
            })
            .then(data => {
                const maxCapacity = data.capacity;

                // Check if max capacity has been reached
                const isMaxCapacityReached = data.participants.length >= maxCapacity;
                resolve(isMaxCapacityReached);
            })
            .catch(error => {
                console.error('Error fetching event capacity:', error);
                reject(error);
            });
    });
}


function signUp(eventId, username) {
  
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ eventId: eventId, username: username })
        })
        .then(response => {
            if (response.ok) {
                console.log("User signed up successfully for event:", eventId);
            } else {
                console.error("Failed to sign up:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error signing up:", error);
        });

}

function getUserName() {
    var username = prompt("Please enter your name:");
    if (username) {
        signUp(getEventIdFromURL(), username);
    } else {
        console.error("Username is empty or canceled.");
    }
   
}

const eventId = getEventIdFromURL();
if (eventId) {
    getEventDetails(eventId);
} else {
    console.error("EventId not found in the URL");
}

// Add event listener to signup button
// const signUpButton = document.getElementById('signUpButton');
// signUpButton.addEventListener('click', getUserName);
