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

    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile', { headers })
    .then(response => {
        if (!response.ok) {
            throw new Error('Autentisering feilet, vennligst logg inn på nytt.');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('username').textContent = data.username;
        document.getElementById('email').textContent = data.email;

        if (data.location) {
            displayLocation("Loading...", data.location);
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
            displayLocation(formattedAddress, currentCoordinates);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function redirectToLogin(message) {
        localStorage.setItem('redirectMessage', message);
        window.location.href = '/html/logginn.html';
    }

    function displayLocation(address, coordinates) {
        const coords = parseCoordinates(coordinates);
        if (coords) {
            document.getElementById("userLocation").textContent = address;
            convertCoordsToAddress(coords.latitude, coords.longitude, function(convertedAddress) {
                document.getElementById("userLocation").textContent = convertedAddress;
            });
        } else {
            console.error('Invalid location format');
        }
    }

    function parseCoordinates(coordString) {
        const parts = coordString.split(', ');
        if (parts.length === 2) {
            const latitude = parseFloat(parts[0]);
            const longitude = parseFloat(parts[1]);
            if (!isNaN(latitude) && !isNaN(longitude)) {
                return { latitude, longitude };
            }
        }
        return null;
    }

    function initMap(latitude, longitude) {
        if (isNaN(latitude) || isNaN(longitude)) {
            console.error("Invalid coordinates for map initialization");
            return;
        }

        const userLocation = { lat: latitude, lng: longitude };
        const map = new google.maps.Map(document.getElementById('map'), {
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

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            if (isNaN(lat) || isNaN(lng)) {
                console.error("Invalid place geometry");
                return;
            }

            currentCoordinates = lat + ', ' + lng;
            updateLocation(place.formatted_address || place.name);
        });
    }

    function convertCoordsToAddress(lat, lng, callback) {
        const geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({ 'location': latlng }, function(results, status) {
            if (status === 'OK' && results[0]) {
                callback(results[0].formatted_address);
            } else {
                console.error('Geocoder failed due to:', status);
                callback("Unknown Address");
            }
        });
    }

    // Load the saved location if available
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
        displayLocation("Loading...", savedLocation);
    }
});
