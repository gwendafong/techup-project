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
            
            const table = document.getElementById('eventDetails');
            table.innerHTML = ''; //clear previous content

            const addRow = (label, value, link=null) => {
                const row = document.createElement('tr');
                const labelCell = document.createElement('td');
                const valueCell = document.createElement('td');
                
                labelCell.textContent = label;
                valueCell.textContent = value;

                row.appendChild(labelCell);
                row.appendChild(valueCell);

                // If a link is provided, append it to the value cell
                if (link) {
                    const linkCell = document.createElement('td');
                    linkCell.appendChild(link);
                    row.appendChild(linkCell);
                }

                table.appendChild(row);
            };

            addRow('Name:', eventDetails.name);
            addRow('Description:', eventDetails.description);
            addRow('Date:', eventDetails.date.toLocaleDateString('en-US'));
            addRow('Time:', eventDetails.time);
            addRow('Location:', eventDetails.location);
            addRow('Organiser:', eventDetails.organiser);
            addRow("Organiser's Email: ", eventDetails.orgEmail);
                
            getNumParticipants(eventId)
                .then(numParticipants => {
                    const participantListLink = document.createElement('a');
                    participantListLink.href = '#'; // Set the href attribute to '#' or the URL to fetch participant list
                    participantListLink.textContent = 'View Participant List';
                    participantListLink.classList.add('participant-link');

                    // Add event listener to the link to fetch and display participant list
                    participantListLink.addEventListener('click', function(event) {
                        event.preventDefault(); // Prevent default link behavior (e.g., navigation)

                        // Fetch the list of participants for the event
                        fetchParticipantList(eventId) 
                        .then(function(participants) {
                            console.log(participants);
                            displayParticipantList(participants);
                        })
                        .catch(function(error) {
                        console.error('Error fetching participant list:', error);
                        });
                    });

                    // Add the link to the table row
                    addRow('Number of people signed up: ', numParticipants, participantListLink); 
                })
                    

            // Check if max capacity is reached
            maxCapacityReached(eventId)
            .then(isReached => {
                const actionButtonsContainer = document.getElementById('actionButtons');
                actionButtonsContainer.innerHTML = ''; // Clear previous content
                
                if (isReached) { 
                    const statusMessage = document.createElement('div');
                    statusMessage.textContent = 'Sorry, there are no more available slots for this event.';
                    statusMessage.style.fontSize = '18px';
                    actionButtonsContainer.appendChild(statusMessage);
                } else {
                    // Display sign-up button
                    const signUpButton = document.createElement('button');
                    signUpButton.textContent = 'Sign up';
                    signUpButton.onclick = () => {
                        openPopup(); 
                    }
                    actionButtonsContainer.appendChild(signUpButton);
                }
            })
            .catch(error => console.error('Error checking max capacity:', error));

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

function getNumParticipants (eventId){
    return fetch('/eventCapacity?eventId=' + eventId)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch event capacity: ' + response.statusText);
            }
        })
        .then(data => {
            console.log('count: ', data.participants.length);
            return data.participants.length;
        })
        .catch(error => {
            console.error('Error fetching number of participants:', error);
            return 0; // Return 0 if there's an error
        });
}

function fetchParticipantList (eventId) {
    return fetch('/eventCapacity?eventId=' + eventId)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch participant list: ' + response.statusText);
            }
        })
        .then(data => {
            return data.participants;
        })
        .catch(error => {
            console.error('Error fetching participants list:', error);
            return 0; // Return 0 if there's an error
        });
}

function displayParticipantList (participants) {
    let participantInfo = "Here are the list of people who have signed up for this activity:\n";
    
    participants.forEach(participant => {
        participantInfo += `${participant}\n`;
    });
    
    alert(participantInfo);
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
                window.location.reload();
            } else {
                console.error("Failed to sign up:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error signing up:", error);
        });

}

/*function getUserName() {
    var firstName = prompt("Please enter your first name:");
    var lastName = prompt("Please enter your last name:");
    
    if (firstName && lastName) {
        var username = firstName + " " + lastName;
        signUp(getEventIdFromURL(), username);
    } else {
        console.error("First name or last name is empty or canceled.");
    }
}*/

//Function to open the popup form
function openPopup() {
    const eventId = getEventIdFromURL();
    document.getElementById("popupForm").style.display = "block";
    
    //Function to handle form submission
    document.getElementById("userNameForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission behavior
    
        var firstName = document.getElementById("firstName").value;
        var lastName = document.getElementById("lastName").value;
            
        if (firstName && lastName) {
            var username = firstName + " " + lastName;
            console.log (username);
            signUp(eventId, username);
        } else {
            console.error("First name or last name is empty.");
        }
        closePopup(); // Close the popup form after submission
    });
}

// Function to close the popup form
function closePopup() {
    document.getElementById("popupForm").style.display = "none";
}


const eventId = getEventIdFromURL();
if (eventId) {
    getEventDetails(eventId);
} else {
    console.error("EventId not found in the URL");
}



