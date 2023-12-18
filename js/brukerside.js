

//Profil page for logged in user. 
// document.addEventListener("DOMContentLoaded", function () {
//     const token = localStorage.getItem('jwt_token');

//     //If no Token, redirect to login page. 
//     if (!token) {
//         redirectToLogin("Vennligst logg inn for å se din profil.");
//         return;
//     }

//     const headers = new Headers({
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//     });

//     fetchUserProfile();
//     initAutocomplete();

//     let tempCoordinates;
//     let tempFormattedAddress;
//     let currentCoordinates;

//     //Fetches the profile of the currently logged-in user from the server
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

//             // Fetch and display stored location
//             fetchStoredLocation();

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

//     //Retrieves the stored location from localStorage and if available,

//     function fetchStoredLocation() {
//         const savedLocation = localStorage.getItem("userLocation");
//         if (savedLocation) {
//             const coords = parseCoordinates(savedLocation);
//             if (coords) {
//                 reverseGeocode(coords.latitude, coords.longitude)
//                     .then(address => {
//                         displayLocation(address, savedLocation);
//                     })
//                     .catch(error => {
//                         console.error('Error fetching address:', error);
//                     });
//             }
//         }
//     }

//     //Updates the user's location on the server.

//     function updateLocation(formattedAddress) {
//         currentCoordinates = tempCoordinates; // Update with the selected location
//         localStorage.setItem("userLocation", currentCoordinates);
//         displayLocation(formattedAddress, currentCoordinates);
//     }

//     //Converts geographic coordinates into a human-readable address using Google Maps Geocoding API

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

//     //Redirect message
//     function redirectToLogin(message) {
//         localStorage.setItem('redirectMessage', message);
//         window.location.href = '/html/logginn.html';
//     }

//     //Displays the user's location on the page and initializes a map centered at the location.
//     function displayLocation(address, coordinates) {
//         document.getElementById("userLocation").textContent = address;
//         const coords = parseCoordinates(coordinates);

//         if (coords) {
//             initMap(coords.latitude, coords.longitude);
//         } else {
//             console.error('Invalid location format');
//         }
//     }

//     // Parses a string containing latitude and longitude into a coordinates object. Returns a coordinates object if the string format is valid.

//     function parseCoordinates(coordString) {
//         const parts = coordString.split(', ');
//         if (parts.length === 2) {
//             const latitude = parseFloat(parts[0]);
//             const longitude = parseFloat(parts[1]);
//             if (!isNaN(latitude) && !isNaN(longitude)) {
//                 return { latitude, longitude };
//             }
//         }
//         return null;
//     }

//     //Show map based on userLocation
//     function initMap(latitude, longitude) {
//         if (isNaN(latitude) || isNaN(longitude)) {
//             console.error("Invalid coordinates for map initialization");
//             return;
//         }

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

//     //Initializes Google Maps Places Autocomplete on an input field.

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
//             if (isNaN(lat) || isNaN(lng)) {
//                 console.error("Invalid place geometry");
//                 return;
//             }

//             // Temporarily store the coordinates and formatted address
//             tempCoordinates = lat + ', ' + lng;
//             tempFormattedAddress = place.formatted_address || place.name;
//         });
//     }
// });





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

            if (data.location) {
                // Convert coordinates to a human-readable address and update map
                const coords = parseCoordinates(data.location);
                if (coords) {
                    reverseGeocode(coords.latitude, coords.longitude)
                        .then(address => {
                            displayLocation(address, data.location);
                        })
                        .catch(error => {
                            console.error('Error fetching address:', error);
                        });
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
        localStorage.setItem("userLocation", tempCoordinates);
        displayLocation(formattedAddress, tempCoordinates);
    
        // Update the server with the new location
        const newLocationData = {
            location: tempCoordinates
        };
    
        fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newLocationData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update location on server');
            }
            // Location updated successfully on the server
        })
        .catch(error => {
            console.error('Error updating location on server:', error);
            // Handle the error here
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

    function redirectToLogin(message) {
        localStorage.setItem('redirectMessage', message);
        window.location.href = '/html/logginn.html';
    }

    function displayLocation(address, coordinates) {
        // Extract the city from the address
        const city = extractCityFromAddress(address);
    
        // Display the city as the user's location
        document.getElementById("userLocation").textContent = city;
    
        const coords = parseCoordinates(coordinates);
        if (coords) {
            initMap(coords.latitude, coords.longitude);
        }
    }
    
    function extractCityFromAddress(address) {
        // Split the address into parts using commas as separators
        const addressParts = address.split(', ');
    
        // The city is usually the first part of the address
        if (addressParts.length > 0) {
            return addressParts[0];
        }
    
        // If there's no city, return the full address
        return address;
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
