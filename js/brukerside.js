//--------- Fetching username, email, location, and profile picture. (update location and upload profile picture) ---------//
let token;

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

    const positionMessageContainer = document.querySelector(".position-message");

    // Function to update the embedded map
    function updateEmbeddedMap(address) {
        const embeddedMap = document.getElementById("embeddedMap");
        const formattedAddress = encodeURIComponent(address);
        embeddedMap.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyASJpumfzHiVTp3ATgQA7AXrS-E1-zdRzo&q=${formattedAddress}`;
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
            profile.location = titleCasedLocation;
            document.getElementById("userLocation").textContent = titleCasedLocation;
            updateEmbeddedMap(titleCasedLocation);
            displayMessage("Profilbilde oppdatert!");
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
