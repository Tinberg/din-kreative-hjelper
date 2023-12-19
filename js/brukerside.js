// document.addEventListener("DOMContentLoaded", function () {
//     const token = localStorage.getItem('jwt_token');

//     if (!token) {
//         redirectToLogin("Vennligst logg inn for å se din profil.");
//         return;
//     }

//     const headers = new Headers({
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//     });

//     let userSelectedAddress = localStorage.getItem('user_selected_address'); // Store user-selected address

//     fetchUserProfile();
//     initAutocomplete();

//     let tempCoordinates;
//     let tempFormattedAddress;

//     function fetchUserProfile() {
//         fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile', { headers })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Autentisering feilet, vennligst logg inn på nytt.');
//             }
//             return response.json();
//         })
//         .then(data => {
//             document.getElementById('username').textContent = data.username;
//             document.getElementById('email').textContent = data.email;

//             if (data.location) {
//                 const coords = parseCoordinates(data.location);
//                 if (coords) {
//                     if (userSelectedAddress) {
//                         displayLocation(userSelectedAddress, data.location); // Display user-selected address if available
//                     } else {
//                         reverseGeocodeAndDisplay(coords.latitude, coords.longitude, data.location);
//                     }
//                 }
//             }

//             const updateButton = document.getElementById('updateLocationButton');
//             if (updateButton) {
//                 updateButton.addEventListener('click', function () {
//                     if (tempCoordinates && tempFormattedAddress) {
//                         updateLocation(tempFormattedAddress);
//                     }
//                 });
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             redirectToLogin(error.message);
//         });
//     }

//     function updateLocation(formattedAddress) {
//         displayLocation(formattedAddress, tempCoordinates);
//         localStorage.setItem('user_selected_address', formattedAddress); // Save the user-selected address

//         // Update the server with the new location
//         const newLocationData = {
//             location: tempCoordinates
//         };

//         fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(newLocationData)
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to update location on server');
//             }
//             // Location updated successfully on the server
//         })
//         .catch(error => {
//             console.error('Error updating location on server:', error);
//         });
//     }

//     function reverseGeocode(lat, lng) {
//         return new Promise((resolve, reject) => {
//             const geocoder = new google.maps.Geocoder();
//             geocoder.geocode({ 'location': { lat, lng } }, function (results, status) {
//                 if (status === 'OK') {
//                     if (results[0]) {
//                         resolve(results[0].formatted_address);
//                     } else {
//                         reject('No results found');
//                     }
//                 } else {
//                     reject('Geocoder failed due to: ' + status);
//                 }
//             });
//         });
//     }

//     function reverseGeocodeAndDisplay(lat, lng, location) {
//         reverseGeocode(lat, lng)
//             .then(address => {
//                 displayLocation(address, location);
//             })
//             .catch(error => {
//                 console.error('Error fetching address:', error);
//             });
//     }

//     function redirectToLogin(message) {
//         localStorage.setItem('redirectMessage', message);
//         window.location.href = '/html/logginn.html';
//     }

//     function displayLocation(address, coordinates) {
//         document.getElementById("userLocation").textContent = address;
//         const coords = parseCoordinates(coordinates);
//         if (coords) {
//             initMap(coords.latitude, coords.longitude);
//         }
//     }

//     function parseCoordinates(coordString) {
//         const parts = coordString.split(', ');
//         if (parts.length === 2) {
//             const latitude = parseFloat(parts[0]);
//             const longitude = parseFloat(parts[1]);
//             return (!isNaN(latitude) && !isNaN(longitude)) ? { latitude, longitude } : null;
//         }
//         return null;
//     }

//     function initMap(latitude, longitude) {
//         const userLocation = { lat: latitude, lng: longitude };
//         const map = new google.maps.Map(document.getElementById('map'), {
//             zoom: 12,
//             center: userLocation
//         });
//         new google.maps.Marker({
//             position: userLocation,
//             map: map
//         });
//     }

//     function initAutocomplete() {
//         const autocomplete = new google.maps.places.Autocomplete(
//             document.getElementById('newLocation'), { types: ['geocode'] });

//         autocomplete.addListener('place_changed', function() {
//             const place = autocomplete.getPlace();
//             if (!place.geometry) {
//                 console.log("No details available for input: '" + place.name + "'");
//                 return;
//             }

//             const lat = place.geometry.location.lat();
//             const lng = place.geometry.location.lng();

//             tempCoordinates = lat + ', ' + lng;
//             tempFormattedAddress = place.formatted_address || place.name;
//         });
//     }
// });















// document.addEventListener('DOMContentLoaded', function() {
//     let map;
//     let marker;
//     const profile = {
//         username: '',
//         email: '',
//         location: '' // Format: 'Street Address, City, Postcode, Country'
//     };

//     // Initialize Google Map
//     function initMap() {
//         map = new google.maps.Map(document.getElementById('map'), {
//             zoom: 8,
//             center: {lat: -34.397, lng: 150.644} // Default center
//         });
//     }

//     // Function to geocode and update map
//     function geocodeAndUpdateMap(address) {
//         const geocoder = new google.maps.Geocoder();
//         geocoder.geocode({'address': address}, function(results, status) {
//             if (status === 'OK') {
//                 map.setCenter(results[0].geometry.location);
//                 if (marker) {
//                     marker.setMap(null);
//                 }
//                 marker = new google.maps.Marker({
//                     map: map,
//                     position: results[0].geometry.location
//                 });
//             } else {
//                 alert('Geocode was not successful for the following reason: ' + status);
//             }
//         });
//     }

//     // Load user profile and update map
//     function loadUserProfile() {
//         fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile/', {
//             method: 'GET',
//             headers: {
//                 'Authorization': 'Bearer ' + localStorage.getItem('jwt_token') // Replace with actual token retrieval method
//             }
//         })
//         .then(response => response.json())
//         .then(data => {
//             profile.username = data.username;
//             profile.email = data.email;
//             profile.location = data.location;
//             document.getElementById('username').textContent = profile.username;
//             document.getElementById('email').textContent = profile.email;
//             document.getElementById('userLocation').textContent = profile.location;
//             geocodeAndUpdateMap(profile.location);
//         })
//         .catch(error => console.error('Error:', error));
//     }

//     // Update location
//     document.getElementById('updateLocationButton').addEventListener('click', function() {
//         const newLocation = document.getElementById('newLocation').value;
//         fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
//             },
//             body: JSON.stringify({location: newLocation})
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Success:', data);
//             profile.location = newLocation;
//             document.getElementById('userLocation').textContent = newLocation;
//             geocodeAndUpdateMap(newLocation);
//         })
//         .catch(error => console.error('Error:', error));
//     });

//     initMap();
//     loadUserProfile();
// });

document.addEventListener('DOMContentLoaded', function() {
    let map;
    let marker;
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        redirectToLogin("Vennligst logg inn for å se din profil.");
        return;
    }

    const profile = {
        username: '',
        email: '',
        location: '' // Format: 'Street Address, City, Postcode, Country'
    };

    // Initialize Google Map
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: {lat: -34.397, lng: 150.644} // Default center
        });
    }

    // Function to geocode and update map
    function geocodeAndUpdateMap(address) {
        const geocoder = new google.maps.Geocoder();
        const positionMessage = document.querySelector('.position-message'); // Select the message element

        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                if (marker) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });

                positionMessage.textContent = 'Sjekk om posisjonen stemmer med kartet.';
                positionMessage.classList.add('success-message');
                positionMessage.classList.remove('error-message');
            } else {
                positionMessage.textContent = 'Den oppgitte adressen er ugyldig. Vennligst kontroller og forsøk på nytt.';
                positionMessage.classList.add('error-message');
                positionMessage.classList.remove('success-message');
            }
        });
    }

    // Load user profile and update map
    function loadUserProfile() {
        fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Autentisering feilet, vennligst logg inn på nytt.');
            }
            return response.json();
        })
        .then(data => {
            profile.username = data.username;
            profile.email = data.email;
            profile.location = data.location;
            document.getElementById('username').textContent = profile.username;
            document.getElementById('email').textContent = profile.email;
            document.getElementById('userLocation').textContent = profile.location;
            geocodeAndUpdateMap(profile.location);
        })
        .catch(error => {
            console.error('Error:', error);
            redirectToLogin(error.message);
        });
    }

    // Update location
    document.getElementById('updateLocationButton').addEventListener('click', function() {
        const newLocation = document.getElementById('newLocation').value;
        fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({location: newLocation})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update location on server');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            profile.location = newLocation;
            document.getElementById('userLocation').textContent = newLocation;
            geocodeAndUpdateMap(newLocation); // Also update the map and show message
        })
        .catch(error => {
            console.error('Error:', error);
            redirectToLogin('Feil ved oppdatering av posisjon');
        });
    });

    function redirectToLogin(message) {
        localStorage.setItem('redirectMessage', message);
        window.location.href = '/html/logginn.html';
    }

    initMap();
    loadUserProfile();
});
