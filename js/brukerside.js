// let token;
// //--------- Fetching username, email, location and profile picture.(update location and upload profile picture) ---------//
// document.addEventListener("DOMContentLoaded", function () {
//   let map;
//   let marker;
//   let messageTimeout;
//   token = localStorage.getItem("jwt_token");

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
//   // Function to handle the submission of the new form
//   function handleNewFormSubmission(event) {
//     event.preventDefault(); // Prevent the default form submission behavior

//     const formData = new FormData();
//     formData.append('title', document.getElementById('title').value);
//     formData.append('description', document.getElementById('description').value);
//     formData.append('image', document.getElementById('image').files[0]);

//     fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/submit-post', {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'Authorization': 'Bearer ' + token
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         // Update the UI here if needed
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
// }

// document.getElementById('postSubmissionForm').addEventListener('submit', handleNewFormSubmission);
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
//   loadAndDisplayUserPosts(); 
// });

// //--------- Form for post service ---------//

// function loadAndDisplayUserPosts() {
//   if (!token) return;
//   fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-posts/', {
//       method: 'GET',
//       headers: {
//           'Authorization': 'Bearer ' + token,
//       },
//   })
//   .then(response => response.json())
//   .then(posts => {
//       const postsContainer = document.getElementById('userPostsContainer');
//       postsContainer.innerHTML = ''; 

//       posts.forEach(post => {
//           const postElement = `
//               <div class="post">
//                   <h3>${post.title}</h3>
//                   <img src="${post.image_url}" alt="${post.title}">
//                   <p>${post.description}</p>
//               </div>
//           `;
//           postsContainer.innerHTML += postElement;
//       });
//   })
//   .catch(error => {
//       console.error('Error:', error);
//   });
// }




let token;
//--------- Fetching username, email, location, and profile picture. (update location and upload profile picture) ---------//
document.addEventListener("DOMContentLoaded", function() {
    token = localStorage.getItem("jwt_token");

    if (!token) {
        redirectToLogin("Vennligst logg inn for å se din profil.");
        return;
    }

    const profile = {
        username: "",
        email: "",
        location: "",
        userPicture: ""
    };

    // Function to update the embedded map
    function updateEmbeddedMap(address) {
        const embeddedMap = document.getElementById("embeddedMap");
        const formattedAddress = encodeURIComponent(address);
        embeddedMap.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${formattedAddress}`;
    }

    // Function to clear the message after a delay
    function clearMessageAfterDelay(container, delay = 15000) {
        setTimeout(() => {
            container.innerHTML = "";
        }, delay);
    }

    // Function to transform text to title case
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    // Function to handle the submission of the new form
    function handleNewFormSubmission(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('image', document.getElementById('image').files[0]);

        fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/submit-post', {
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
            console.log('Success:', data);
            alert("Innlegg lagt til!");
            // Optionally reset the form or update the UI here
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Det oppsto en feil under innsending av innlegget.");
        });
    }

    document.getElementById('postSubmissionForm').addEventListener('submit', handleNewFormSubmission);

    // Function to load user profile and update UI
    function loadUserProfile() {
        fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
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
            profile.location = toTitleCase(data.location);
            profile.userPicture = data.profile_picture;

            document.getElementById('username').textContent = profile.username;
            document.getElementById('email').textContent = profile.email;
            document.getElementById('userLocation').textContent = profile.location;

            const profileImgElement = document.getElementById('profile_picture');
            if (profile.userPicture) {
                profileImgElement.src = profile.userPicture;
            } else {
                profileImgElement.src = '/images/no-profile.png';
            }

            updateEmbeddedMap(profile.location);
        })
        .catch(error => {
            console.error('Error:', error);
            redirectToLogin(error.message);
        });
    }

    // Function to update location
    document.getElementById("updateLocationButton").addEventListener("click", function() {
        const newLocation = document.getElementById("newLocation").value;
        const titleCasedLocation = toTitleCase(newLocation);
        fetch("https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({ location: titleCasedLocation })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update location on server");
            }
            return response.json();
        })
        .then(data => {
            console.log("Success:", data);
            profile.location = titleCasedLocation;
            document.getElementById("userLocation").textContent = titleCasedLocation;
            updateEmbeddedMap(titleCasedLocation);
        })
        .catch(error => {
            console.error("Error:", error);
            redirectToLogin("Feil ved oppdatering av posisjon");
        });
    });

    function redirectToLogin(message) {
        localStorage.setItem("redirectMessage", message);
        window.location.href = "/html/logginn.html";
    }

    // Handle file selection and upload profile img
    document.getElementById('uploadTrigger').addEventListener('click', () => {
        document.getElementById('profilePicture').click();
    });

    document.getElementById('profilePicture').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
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
            };
            reader.readAsDataURL(file);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            alert("Failed to upload the image. Please try again.");
        });
    });

    // Function to load and display user posts
    function loadAndDisplayUserPosts() {
        if (!token) return;
        fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-posts/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('userPostsContainer');
            postsContainer.innerHTML = '';

            posts.forEach(post => {
                const postElement = `
                    <div class="post">
                        <h3>${post.title}</h3>
                        <img src="${post.image_url}" alt="${post.title}">
                        <p>${post.description}</p>
                    </div>
                `;
                postsContainer.innerHTML += postElement;
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    loadUserProfile();
    loadAndDisplayUserPosts();
});
