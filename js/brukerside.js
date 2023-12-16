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

    initAutocomplete();

    let currentCoordinates;

    function updateLocation(formattedAddress) {
        if (!currentCoordinates) {
            console.error("currentCoordinates is undefined");
            return;
        }

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
        const locationElement = document.getElementById("userLocation");
        locationElement.textContent = locationString;

        const locationParts = locationString.split(', ');
        if (locationParts.length === 2 && !isNaN(locationParts[0]) && !isNaN(locationParts[1])) {
            const latitude = parseFloat(locationParts[0]);
            const longitude = parseFloat(locationParts[1]);

            convertCoordsToAddress(latitude, longitude, function(address) {
                document.getElementById("userLocation").textContent = address;
            });
            initMap(latitude, longitude);
        } else {
            console.error('Invalid location format');
        }
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
});
