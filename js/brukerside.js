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

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("jwt_token");

  if (!token) {
    redirectToLogin("Vennligst logg inn for å se din profil.");
    return;
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  let userSelectedAddress = localStorage.getItem("user_selected_address"); // Store user-selected address

  fetchUserProfile();
  initAutocomplete();

  let tempCoordinates;
  let tempFormattedAddress;

  const updateButton = document.getElementById("updateLocationButton");
  if (updateButton) {
    updateButton.addEventListener("click", function () {
      if (tempCoordinates && tempFormattedAddress) {
        updateLocation(tempFormattedAddress);
      }
    });
  }

  function fetchUserProfile() {
    fetch(
      "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile",
      { headers }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Autentisering feilet, vennligst logg inn på nytt.");
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("username").textContent = data.username;
        document.getElementById("email").textContent = data.email;

        if (data.location) {
            const coords = parseCoordinates(data.location);
            if (coords) {
                userSelectedAddress = localStorage.getItem("user_selected_address");
                if (userSelectedAddress) {
                    displayLocation(userSelectedAddress, data.location);
                } else {
                    // Fallback to reverse geocoding or prompt user for address
                    reverseGeocodeAndDisplay(coords.latitude, coords.longitude);
                }
            }
        }
    })
    .catch(error => {
        console.error("Error:", error);
        redirectToLogin(error.message);
      });
  }

  function updateLocation(formattedAddress) {
    displayLocation(formattedAddress, tempCoordinates);
    localStorage.setItem("user_selected_address", formattedAddress); // Save the user-selected address

    // Update the server with the new location
    const newLocationData = {
      location: tempCoordinates,
    };

    fetch(
      "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLocationData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update location on server");
        }
        // Location updated successfully on the server
      })
      .catch((error) => {
        console.error("Error updating location on server:", error);
      });
  }

  function reverseGeocode(lat, lng) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'location': { lat, lng } }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    console.log(results[0]); // Log the result for inspection

                    // Construct the address from the most specific to the most general component
                    let addressParts = [];
                    const addressComponents = results[0].address_components;
                    
                    for (let component of addressComponents) {
                        if (component.types.includes('street_address') || 
                            component.types.includes('route') || 
                            component.types.includes('locality') ||
                            component.types.includes('administrative_area_level_1') || 
                            component.types.includes('country')) {
                            addressParts.push(component.long_name);
                        }
                    }

                    const address = addressParts.join(', ');
                    resolve(address);
                } else {
                    reject('No results found');
                }
            } else {
                reject('Geocoder failed due to: ' + status);
            }
        });
    });
}


  function reverseGeocodeAndDisplay(lat, lng) {
    reverseGeocode(lat, lng)
      .then((address) => {
        displayLocation(address, { latitude: lat, longitude: lng });
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
      });
  }

  function redirectToLogin(message) {
    localStorage.setItem("redirectMessage", message);
    window.location.href = "/html/logginn.html";
  }

  function displayLocation(address, coordinates) {
    document.getElementById("userLocation").textContent = address;

    let coords;
    if (typeof coordinates === "string") {
      coords = parseCoordinates(coordinates);
    } else if (
      typeof coordinates === "object" &&
      coordinates.latitude &&
      coordinates.longitude
    ) {
      coords = coordinates;
    }

    if (coords) {
      initMap(coords.latitude, coords.longitude);
    }
  }

  function parseCoordinates(coordString) {
    if (typeof coordString === "string") {
      const parts = coordString.split(", ");
      if (parts.length === 2) {
        const latitude = parseFloat(parts[0]);
        const longitude = parseFloat(parts[1]);
        return !isNaN(latitude) && !isNaN(longitude)
          ? { latitude, longitude }
          : null;
      }
    }
    return null;
  }

  function initMap(latitude, longitude) {
    const userLocation = { lat: latitude, lng: longitude };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: userLocation,
    });
    new google.maps.Marker({
      position: userLocation,
      map: map,
    });
  }

  function initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("newLocation"),
      { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", function () {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.log("No details available for input: '" + place.name + "'");
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      tempCoordinates = lat + ", " + lng;
      tempFormattedAddress = place.formatted_address || place.name;
    });
  }
});
