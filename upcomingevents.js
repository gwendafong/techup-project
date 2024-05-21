// Function to handle showing details of an event
function eventDetails(eventId) {
    window.location.href = '/event-details.html?eventId=' + encodeURIComponent(eventId);
}

// Function to format date as "day month year"
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}


// Fetch events data from the server
fetch('/events')
.then(response => response.text())
.then(data => {
    const eventsList = document.getElementById('eventsList');
    const eventsListMessage = document.getElementById('eventsListMessage');
    
    // Split the data by newline to get individual events
    const events = data.split('\n').filter(event => event.trim() !== '');
    const currentDate = new Date();

    if (events.length === 0) {
        eventsListMessage.innerHTML = 'There are no upcoming activities. Be the first to create a new one!';
        const createEventButton = document.createElement('button');
        createEventButton.textContent = 'Jio others to do something fun';
        createEventButton.classList.add('button');
        createEventButton.addEventListener('click', function() {
            // Redirect to the page to create a new event
            window.location.href = 'newevent.html';
        });
        eventsList.parentNode.appendChild(createEventButton); // Append the button after the eventsList

    } else {
        eventsListMessage.innerHTML = 'Here are the upcoming activities! Feel free to sign up for anything that interests you. And jio your friends! The more the merrier.';
    
     // Parse dates and sort events by date
    const filteredEvents = events.map(event => {
        const [eventId, eventName, eventDescription, eventDate, eventTime, eventLocation, eventOrganiser, eventOrgEmail, maxCapacity] = event.split(' // ');
        return {
            id: eventId,
            name: eventName,
            description: eventDescription,
            date: new Date(eventDate),
            time: eventTime,
            location: eventLocation,
            organiser: eventOrganiser,
            orgEmail: eventOrgEmail,
            maxCapacity: maxCapacity
        };
        
    }).filter(event => event.date > currentDate)

    // Filter and sort events by date and time
    const sortedEvents = filteredEvents.sort((a, b) => a.date - b.date);

    // Populate the events table with sorted events
    sortedEvents.forEach(event => {
        const row = document.createElement('tr');
        const eventNameCell = document.createElement('td');
        eventNameCell.textContent = event.name;
    
        const eventDateCell = document.createElement('td');
        eventDateCell.textContent = formatDate(event.date);
    
        const detailsButtonCell = document.createElement('td');
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Tell Me More';
        detailsButton.classList.add('button');
    
        detailsButton.addEventListener('click', () => {
            eventDetails(event.id);
        });

        detailsButtonCell.appendChild(detailsButton);
        row.appendChild(eventNameCell);
        row.appendChild(eventDateCell);
        row.appendChild(detailsButtonCell);
        eventsList.appendChild(row);
    });}

})
.catch(error => console.error('Error fetching events:', error));
