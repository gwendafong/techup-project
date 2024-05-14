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
            //addRow('Max Capacity:', eventDetails.maxCapacity);

        } else {
            console.log("Event not found");
        }
    })
    .catch(error => console.error('Error retrieving event details:', error));
}

const eventId = getEventIdFromURL();
if (eventId) {
    getEventDetails(eventId);
} else {
    console.error("EventId not found in the URL");
}