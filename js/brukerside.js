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

    let userSelectedAddress = localStorage.getItem('user_selected_address'); // Store user-selected address

    fetchUserProfile();
    initAutocomplete();

    let tempCoordinates;
    let tempFormattedAddress;

    function fetchUserProfile() {
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
    
            if (data.selected_address) {
                // Use the user-selected address from the server
                displayLocation(data.selected_address, data.location);
            } else if (data.location) {
                // Fallback to reverse geocoding if no selected address
                const coords = parseCoordinates(data.location);
                if (coords) {
                    reverseGeocodeAndDisplay(coords.latitude, coords.longitude, data.location);
                }
            }
    
            const updateButton = document.getElementById('updateLocationButton');
            if (updateButton) {
                updateButton.addEventListener('click', function () {
                    if (tempCoordinates && tempFormattedAddress) {
                        updateLocation(tempFormattedAddress);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            redirectToLogin(error.message);
        });
    }
    

    function updateLocation(formattedAddress) {
        displayLocation(formattedAddress, tempCoordinates);
        localStorage.setItem('user_selected_address', formattedAddress); // Save the user-selected address

        // Update the server with the new location
        const newLocationData = {
            location: tempCoordinates
        };
    
        fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/save-address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ address: formattedAddress })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update location on server');
            }
            // Location updated successfully on the server
        })
        .catch(error => {
            console.error('Error updating location on server:', error);
        });
    }

    function reverseGeocode(lat, lng) {
        return new Promise((resolve, reject) => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'location': { lat, lng } }, function (results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        resolve(results[0].formatted_address);
                    } else {
                        reject('No results found');
                    }
                } else {
                    reject('Geocoder failed due to: ' + status);
                }
            });
        });
    }

    function reverseGeocodeAndDisplay(lat, lng, location) {
        reverseGeocode(lat, lng)
            .then(address => {
                displayLocation(address, location);
            })
            .catch(error => {
                console.error('Error fetching address:', error);
            });
    }

    function redirectToLogin(message) {
        localStorage.setItem('redirectMessage', message);
        window.location.href = '/html/logginn.html';
    }

    function displayLocation(address, coordinates) {
        document.getElementById("userLocation").textContent = address;
        const coords = parseCoordinates(coordinates);
        if (coords) {
            initMap(coords.latitude, coords.longitude);
        }
    }

    function parseCoordinates(coordString) {
        const parts = coordString.split(', ');
        if (parts.length === 2) {
            const latitude = parseFloat(parts[0]);
            const longitude = parseFloat(parts[1]);
            return (!isNaN(latitude) && !isNaN(longitude)) ? { latitude, longitude } : null;
        }
        return null;
    }

    function initMap(latitude, longitude) {
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

            tempCoordinates = lat + ', ' + lng;
            tempFormattedAddress = place.formatted_address || place.name;
        });
    }
});
