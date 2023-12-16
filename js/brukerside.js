document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        redirectToLogin("Vennligst logg inn for å se din profil.");
        return;
    }

    const headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    });

    // Fetch user profile data from the server
    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile', { headers })
    .then(response => {
        if (!response.ok) {
            throw new Error('Autentisering feilet, vennligst logg inn på nytt.');
        }
        return response.json();
    })
    .then(data => {
        // Display username and email
        document.getElementById('username').textContent = data.username;
        document.getElementById('email').textContent = data.email;

        // Handle and display location
        if (data.location) {
            localStorage.setItem("userLocation", data.location);
            displayLocation(data.location);
        }

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

    // Initialize Google Maps Autocomplete
    initAutocomplete();

    let currentCoordinates;

    function updateLocation(formattedAddress) {
        fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ location: currentCoordinates })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update location.');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("userLocation", currentCoordinates);
            // Update both the display and the map
            displayLocation(formattedAddress);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function redirectToLogin(message) {
        localStorage.setItem('redirectMessage', message);
        window.location.href = '/html/logginn.html';
    }

    function displayLocation(locationString) {
        // Assuming that the locationString format is 'latitude, longitude'
        const locationParts = locationString.split(', ');
        if (locationParts.length === 2) {
            const latitude = parseFloat(locationParts[0]);
            const longitude = parseFloat(locationParts[1]);
    
            // Convert coordinates to formatted address and update 'Din posisjon'
            convertCoordsToAddress(latitude, longitude, function(address) {
                document.getElementById("userLocation").textContent = address;
            });
    
            // Initialize the map with the new coordinates
            initMap(latitude, longitude);
        } else {
            // Handle non-coordinate format (direct formatted address)
            document.getElementById("userLocation").textContent = locationString;
            // Additional logic to update the map if needed
        }
    }

    function initMap(latitude, longitude) {
        var userLocation = { lat: latitude, lng: longitude };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: userLocation
        });
        new google.maps.Marker({
            position: userLocation,
            map: map
        });
    }

    function initAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('newLocation'), { types: ['geocode'] });

            autocomplete.addListener('place_changed', function() {
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    console.log("No details available for input: '" + place.name + "'");
                    return;
                }

                currentCoordinates = place.geometry.location.lat() + ', ' + place.geometry.location.lng();
                updateLocation(place.formatted_address); // Call updateLocation with the formatted address
        });
    }

    function convertCoordsToAddress(lat, lng, callback) {
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({ 'location': latlng }, function(results, status) {
            if (status === 'OK' && results[0]) {
                callback(results[0].formatted_address);
            } else {
                console.error('Geocoder failed due to: ' + status);
                callback("Unknown Address");
            }
        });
    }
});
