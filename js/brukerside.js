// //--------- Fetching username, email, location and profile picture.(update location and upload profile picture) ---------//
// document.addEventListener("DOMContentLoaded", function () {
//   let map;
//   let marker;
//   let messageTimeout;
//   const token = localStorage.getItem("jwt_token");

//   if (!token) {
//     redirectToLogin("Vennligst logg inn for å se din profil.");
//     return;
//   }

//   const profile = {
//     username: "",
//     email: "",
//     location: "",
//     userPicture: "" 
// };


//   // Initialize Google Map
//   function initMap() {
//     map = new google.maps.Map(document.getElementById("map"), {
//       zoom: 8,
//       center: { lat: -34.397, lng: 150.644 }, // Default center
//     });
//   }

//   // Function to geocode and update map
//   function geocodeAndUpdateMap(address, displayMessage = false) {
//     const geocoder = new google.maps.Geocoder();
//     const positionMessageContainer =
//       document.querySelector(".position-message");

//     geocoder.geocode({ address: address }, function (results, status) {
//       if (status === "OK") {
//         map.setCenter(results[0].geometry.location);
//         if (marker) {
//           marker.setMap(null);
//         }
//         marker = new google.maps.Marker({
//           map: map,
//           position: results[0].geometry.location,
//         });

//         if (displayMessage) {
//           positionMessageContainer.innerHTML = `<p class="success-message">Vennligst kontroller at den angitte posisjonen samsvarer med kartet</p>`;
//           clearMessageAfterDelay(positionMessageContainer);
//         }
//       } else {
//         if (displayMessage) {
//           positionMessageContainer.innerHTML = `<p class="error-message">Den oppgitte adressen er ugyldig. Vennligst kontroller og forsøk på nytt.</p>`;
//           clearMessageAfterDelay(positionMessageContainer);
//         }
//       }
//     });
//   }

//   // Function to clear the message after 15 seconds
//   function clearMessageAfterDelay(container) {
//     // Clear any existing timeout
//     clearTimeout(messageTimeout);

//     // Set a new timeout
//     messageTimeout = setTimeout(function () {
//       container.innerHTML = "";
//     }, 15000);
//   }

//   // Function to transform text to title case
//   function toTitleCase(str) {
//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   }

//   // Load user profile and update map
//   function loadUserProfile() {
//     fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile/', {
//         method: 'GET',
//         headers: {
//             'Authorization': 'Bearer ' + token,
//         },
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Autentisering feilet, vennligst logg inn på nytt.');
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Update the profile object
//         profile.username = data.username;
//         profile.email = data.email;
//         profile.location = toTitleCase(data.location); // Apply title casing
//         profile.userPicture = data.profile_picture; // Update profile picture

//         // Update the UI
//         document.getElementById('username').textContent = profile.username;
//         document.getElementById('email').textContent = profile.email;
//         document.getElementById('userLocation').textContent = profile.location;
        
//         // Update the profile picture in the UI
//         const profileImgElement = document.getElementById('profile_picture');
//         if (profile.userPicture) {
//             profileImgElement.src = profile.userPicture;
//             profileImgElement.alt = 'User profile picture';
//         } else {
//             profileImgElement.src = '/images/no-profile.png'; 
//             profileImgElement.alt = 'No profile picture';
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         redirectToLogin(error.message);
//     });
// }


//   // Update location
//   document
//     .getElementById("updateLocationButton")
//     .addEventListener("click", function () {
//       const newLocation = document.getElementById("newLocation").value;
//       const titleCasedLocation = toTitleCase(newLocation); // Apply title casing
//       fetch(
//         "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + token,
//           },
//           body: JSON.stringify({ location: titleCasedLocation }),
//         }
//       )
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Failed to update location on server");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           console.log("Success:", data);
//           profile.location = titleCasedLocation;
//           document.getElementById("userLocation").textContent =
//             titleCasedLocation;
//           geocodeAndUpdateMap(titleCasedLocation, true); // Update map and show message
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//           redirectToLogin("Feil ved oppdatering av posisjon");
//         });
//     });

//   function redirectToLogin(message) {
//     localStorage.setItem("redirectMessage", message);
//     window.location.href = "/html/logginn.html";
//   }

// // Trigger file input when the custom button is clicked
// document.getElementById('uploadTrigger').addEventListener('click', function() {
//     document.getElementById('profilePicture').click();
// });

// // Handle file selection and upload profile img
// document.getElementById('profilePicture').addEventListener('change', function(event) {
//     const file = event.target.files[0];
//     if (!file) {
//         return; // If no file is selected, do nothing
//     }

//     const formData = new FormData();
//     formData.append('profile_picture', file);

//     fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-profile-picture', {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'Authorization': 'Bearer ' + token
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok.');
//         }
//         return response.json();
//     })
//     .then(data => {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             const profileImage = document.getElementById('profile_picture');
//             profileImage.src = e.target.result;
//             profileImage.alt = 'Profile picture';
//         };
//         reader.readAsDataURL(file);
//     })
//     .catch(error => {
//         console.error('There has been a problem with your fetch operation:', error);
//         alert("Failed to upload the image. Please try again.");
//     });
// });

//   initMap();
//   loadUserProfile();
// });

// //--------- Form for post service ---------//



//--------- Fetching username, email, location and profile picture.(update location and upload profile picture) ---------//
let token;
document.addEventListener("DOMContentLoaded", function () {
  let map;
  let marker;
  let messageTimeout;
  const token = localStorage.getItem("jwt_token");
  const profile = {
    username: "",
    email: "",
    location: "",
    userPicture: "" 
};

  if (!token) {
    redirectToLogin("Vennligst logg inn for å se din profil.");
    return;
  }



  // Initialize Google Map
  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: -34.397, lng: 150.644 }, // Default center
    });
  }

  // Function to geocode and update map
  function geocodeAndUpdateMap(address, displayMessage = false) {
    const geocoder = new google.maps.Geocoder();
    const positionMessageContainer =
      document.querySelector(".position-message");

    geocoder.geocode({ address: address }, function (results, status) {
      if (status === "OK") {
        map.setCenter(results[0].geometry.location);
        if (marker) {
          marker.setMap(null);
        }
        marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
        });

        if (displayMessage) {
          positionMessageContainer.innerHTML = `<p class="success-message">Vennligst kontroller at den angitte posisjonen samsvarer med kartet</p>`;
          clearMessageAfterDelay(positionMessageContainer);
        }
      } else {
        if (displayMessage) {
          positionMessageContainer.innerHTML = `<p class="error-message">Den oppgitte adressen er ugyldig. Vennligst kontroller og forsøk på nytt.</p>`;
          clearMessageAfterDelay(positionMessageContainer);
        }
      }
    });
  }

  // Function to clear the message after 15 seconds
  function clearMessageAfterDelay(container) {
    // Clear any existing timeout
    clearTimeout(messageTimeout);

    // Set a new timeout
    messageTimeout = setTimeout(function () {
      container.innerHTML = "";
    }, 15000);
  }

  // Function to transform text to title case
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  // Load user profile and update map
  function loadUserProfile() {
    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Autentisering feilet, vennligst logg inn på nytt.');
        }
        return response.json();
    })
    .then(data => {
        // Update the profile object
        profile.username = data.username;
        profile.email = data.email;
        profile.location = toTitleCase(data.location); // Apply title casing
        profile.userPicture = data.profile_picture; // Update profile picture

        // Update the UI
        document.getElementById('username').textContent = profile.username;
        document.getElementById('email').textContent = profile.email;
        document.getElementById('userLocation').textContent = profile.location;
        
        // Update the profile picture in the UI
        const profileImgElement = document.getElementById('profile_picture');
        if (profile.userPicture) {
            profileImgElement.src = profile.userPicture;
            profileImgElement.alt = 'User profile picture';
        } else {
            profileImgElement.src = '/images/no-profile.png'; 
            profileImgElement.alt = 'No profile picture';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        redirectToLogin(error.message);
    });
}


  // Update location
  document
    .getElementById("updateLocationButton")
    .addEventListener("click", function () {
      const newLocation = document.getElementById("newLocation").value;
      const titleCasedLocation = toTitleCase(newLocation); // Apply title casing
      fetch(
        "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ location: titleCasedLocation }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update location on server");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          profile.location = titleCasedLocation;
          document.getElementById("userLocation").textContent =
            titleCasedLocation;
          geocodeAndUpdateMap(titleCasedLocation, true); // Update map and show message
        })
        .catch((error) => {
          console.error("Error:", error);
          redirectToLogin("Feil ved oppdatering av posisjon");
        });
    });

  function redirectToLogin(message) {
    localStorage.setItem("redirectMessage", message);
    window.location.href = "/html/logginn.html";
  }

// Trigger file input when the custom button is clicked
document.getElementById('uploadTrigger').addEventListener('click', function() {
    document.getElementById('profilePicture').click();
});

// Handle file selection and upload profile img
document.getElementById('profilePicture').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        return; // If no file is selected, do nothing
    }


    const formData = new FormData();
    formData.append('profile_picture', file);

    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-profile-picture', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profileImage = document.getElementById('profile_picture');
            profileImage.src = e.target.result;
            profileImage.alt = 'Profile picture';
        };
        reader.readAsDataURL(file);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        alert("Failed to upload the image. Please try again.");
    });
});
document.getElementById('serviceForm').addEventListener('submit', postService);
  initMap();
  loadUserProfile();
  loadUserServices();
});

//--------- Form for post service ---------//

function postService(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  formData.append('username', profile.username);
  formData.append('location', profile.location);

  fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/post-service', {
      method: 'POST',
      body: formData,
      headers: {
          'Authorization': 'Bearer ' + token
      }
  })
  .then(response => response.json())
  .then(data => {
      loadUserServices(); // Reload to show new service
  })
  .catch(error => console.error('Error posting service:', error));
}

function loadUserServices() {
  fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/get-user-services', {
      headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(response => response.json())
  .then(services => {
      const servicesContainer = document.getElementById('userServicesContainer');
      servicesContainer.innerHTML = '';
      services.forEach(service => {
          const serviceElement = document.createElement('div');
          serviceElement.innerHTML = `
              <h3>${service.title}</h3>
              <img src="${service.imageUrl}" alt="${service.title}">
              <p>${service.description}</p>
          `;
          servicesContainer.appendChild(serviceElement);
      });
  })
  .catch(error => console.error('Error fetching services:', error));
}