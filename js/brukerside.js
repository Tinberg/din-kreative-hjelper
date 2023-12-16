document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('jwt_token');
    
    // Check if the JWT token exists (user is authenticated)
    if (!token) {
        redirectToLogin("Vennligst logg inn for å se din profil.");
        return;
    }

    // Set headers for the fetch request, including the JWT token
    const headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    });

    // Fetch the user profile data from the server
    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile', { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error('Autentisering feilet, vennligst logg inn på nytt.');
            }
            return response.json();
        })
        .then(data => {
            // Display the user's username and email
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
                
            // Display the user's location
            const locationElement = document.getElementById("userLocation");
            locationElement.textContent = data.location || "Din posisjon er ikke angitt";

            // Event listener for updating location
            const updateButton = document.getElementById('updateLocationButton');
            if (updateButton) {
                updateButton.addEventListener('click', function () {
                    const newLocation = document.getElementById('newLocation').value;
                    updateLocation(newLocation);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            redirectToLogin(error.message);
        });

    // Function to update user location
    function updateLocation(newLocation) {
        fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ location: newLocation })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update location.');
            }
            return response.json();
        })
        .then(data => {
            // Update the location on the page and clear the input field
            const locationElement = document.getElementById("userLocation");
            locationElement.textContent = newLocation;
            document.getElementById('newLocation').value = '';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Function to redirect to the login page with a message
    function redirectToLogin(message) {
        localStorage.setItem('redirectMessage', message);
        window.location.href = '/html/logginn.html';
    }
});

//Function for GoogleMaps
function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to geographical location types.
    const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('newLocation'), {types: ['geocode']});

    // When the user selects an address from the dropdown, you can use the place details for something
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        // Place details like place.name, place.geometry, etc.
    });
  }


  function initMap() {
    // The location you want to center your map on
    var centerLocation = { lat: -34.397, lng: 150.644 };

    // Map options
    var mapOptions = {
        zoom: 8, // Set the zoom level
        center: centerLocation, // Center the map on your location
        // You can add additional map options here
    };

    // Create a new map instance
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // If you want to add markers, info windows, or other features,
    // you can add them here using the 'map' variable
}

// Load the map when the Google Maps API library is loaded
// This assumes you've included the Google Maps script tag in your HTML
// with a 'callback=initMap' parameter.
