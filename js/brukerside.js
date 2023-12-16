// document.addEventListener("DOMContentLoaded", function () {
//     // Retrieve the JWT token from localStorage
//     const token = localStorage.getItem('jwt_token');
    
//     // Check if the JWT token exists (user is authenticated)
//     if (!token) {
//         redirectToLogin("Vennligst logg inn for å se din profil.");
//         return;
//     }

//     // Set headers for the fetch request, including the JWT token
//     const headers = new Headers({
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//     });

//     // Fetch the user profile data from the server
//     fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile', { headers })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Autentisering feilet, vennligst logg inn på nytt.');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Display the user's username and email
//             document.getElementById('username').textContent = data.username;
//             document.getElementById('email').textContent = data.email;
                
//             // Display the user's location
//             const locationElement = document.getElementById("userLocation");
//             locationElement.textContent = data.location || "Din posisjon er ikke angitt";

//             // Event listener for updating location
//             const updateButton = document.getElementById('updateLocationButton');
//             if (updateButton) {
//                 updateButton.addEventListener('click', function () {
//                     const newLocation = document.getElementById('newLocation').value;
//                     updateLocation(newLocation);
//                 });
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             redirectToLogin(error.message);
//         });

//     // Function to update user location
//     function updateLocation(newLocation) {
//         fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({ location: newLocation })
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to update location.');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Update the location on the page and clear the input field
//             const locationElement = document.getElementById("userLocation");
//             locationElement.textContent = newLocation;
//             document.getElementById('newLocation').value = '';
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//     }

//     // Function to redirect to the login page with a message
//     function redirectToLogin(message) {
//         localStorage.setItem('redirectMessage', message);
//         window.location.href = '/html/logginn.html';
//     }
// });

// //Function for GoogleMaps
// document.addEventListener("DOMContentLoaded", function () {
//     // Function to initialize the Google Map
//     function initMap(latitude, longitude) {
//         var userLocation = { lat: latitude, lng: longitude };
//         var map = new google.maps.Map(document.getElementById('map'), {
//             zoom: 12,
//             center: userLocation
//         });
//         new google.maps.Marker({
//             position: userLocation,
//             map: map
//         });
//     }

//     // Function to display the user's location on the map
//     function displayUserLocation(userLocation) {
//         if (userLocation) {
//             const locationParts = userLocation.split(', ');
//             const latitude = parseFloat(locationParts[0]);
//             const longitude = parseFloat(locationParts[1]);
//             initMap(latitude, longitude);
//         }
//     }

//     // Initialize the Autocomplete feature for the address input
//     function initAutocomplete() {
//         const autocomplete = new google.maps.places.Autocomplete(
//             document.getElementById('newLocation'), {types: ['geocode']});

//         autocomplete.addListener('place_changed', function() {
//             const place = autocomplete.getPlace();
//             if (!place.geometry) {
//                 console.log("No details available for input: '" + place.name + "'");
//                 return;
//             }
//             // Update location in the input field
//             document.getElementById('newLocation').value = 
//                 place.geometry.location.lat() + ', ' + place.geometry.location.lng();
//         });
//     }

//     // Assuming you have user's location in a format "latitude, longitude"
//     // For example, you can fetch it from your server or local storage
//     const userLocation = '40.7128, -74.0060'; // Replace with actual data
//     displayUserLocation(userLocation);

//     initAutocomplete(); // Initialize the autocomplete feature
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

        // Check if user location is available in localStorage
        const userLocation = localStorage.getItem("userLocation");
        if (userLocation) {
            const locationParts = userLocation.split(', ');
            const latitude = parseFloat(locationParts[0]);
            const longitude = parseFloat(locationParts[1]);

            // Call convertCoordsToAddress to get the address
            convertCoordsToAddress(latitude, longitude, function(address) {
                const locationElement = document.getElementById("userLocation");
                locationElement.textContent = address;

                // Initialize the map with the retrieved coordinates
                initMap(latitude, longitude);
            });
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
            const locationElement = document.getElementById("userLocation");
            locationElement.textContent = formattedAddress;

            if (currentCoordinates) {
                const locationParts = currentCoordinates.split(', ');
                const latitude = parseFloat(locationParts[0]);
                const longitude = parseFloat(locationParts[1]);
                initMap(latitude, longitude);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function redirectToLogin(message) {
        localStorage.setItem('redirectMessage', message);
        window.location.href = '/html/logginn.html';
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
            updateLocation(place.formatted_address);
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
