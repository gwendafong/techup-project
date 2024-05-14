// Function to retrieve event details from the server
function getEventDetails(eventName) {
    // Make an AJAX request to the server to retrieve event details
    fetch('/get-event-details?eventName=' + encodeURIComponent(eventName))
        .then(response => response.json())
        .then(data => {
            // Populate HTML elements with event details
            const eventDetailsDiv = document.getElementById('eventDetails');
            eventDetailsDiv.innerHTML = `
                <h2>${data.name}</h2>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Date:</strong> ${formatDate(data.date)}</p>
                <p><strong>Location:</strong> ${data.location}</p>
                <p><strong>Organiser:</strong> ${data.organiser}</p>
                <p><strong>Organiser's Email:</strong> ${data.orgEmail}</p>
            `;
        })
        .catch(error => console.error('Error fetching event details:', error));
}

// Function to format date as "day month year"
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Extract event name from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const eventName = urlParams.get('eventName');

// Call function to retrieve event details
getEventDetails(eventName);