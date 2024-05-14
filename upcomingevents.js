
        // Function to handle showing details of an event
        function eventDetails(eventName) {
            window.location.href = '/event-details.html?eventName=' + encodeURIComponent(eventName);
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
                
                // Split the data by newline to get individual events
                const events = data.split('\n').filter(event => event.trim() !== '');
                const currentDate = new Date();
        
                 // Parse dates and sort events by date
                const sortedEvents = events.map(event => {
                const [eventName, eventDescription, eventDate, eventLocation, eventOrganiser, eventOrgEmail] = event.split(' // ');
                return {
                    name: eventName,
                    description: eventDescription,
                    date: new Date(eventDate),
                    location: eventLocation,
                    organiser: eventOrganiser,
                    orgEmail: eventOrgEmail
                };
                }).filter(event => event.date > currentDate)
            
                .sort((a, b) => a.date - b.date);
                
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
                    eventDetails(event.name);
                });
            
                detailsButtonCell.appendChild(detailsButton);
                row.appendChild(eventNameCell);
                row.appendChild(eventDateCell);
                row.appendChild(detailsButtonCell);
                eventsList.appendChild(row);
            });

            })
        .catch(error => console.error('Error fetching events:', error));
