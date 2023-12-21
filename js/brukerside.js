let token;
document.addEventListener("DOMContentLoaded", function () {
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

    let messageTimeout; // To clear the message after a delay
    const positionMessageContainer = document.querySelector(".position-message");
    const createPostMessageContainer = document.getElementById("createPostMessage");
    const myPostsMessageContainer = document.getElementById("myPosts");

    function updateEmbeddedMap(address) {
        const embeddedMap = document.getElementById("embeddedMap");
        const formattedAddress = encodeURIComponent(address);
        embeddedMap.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${formattedAddress}`;
    }

    function displayMessage(container, message, isError = false) {
        container.innerHTML = `<p class="${isError ? 'error-message' : 'success-message'}">${message}</p>`;
        clearMessageAfterDelay(container);
    }

    function clearMessageAfterDelay(container) {
        clearTimeout(messageTimeout);
        messageTimeout = setTimeout(() => {
            container.innerHTML = "";
        }, 15000);
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    document.getElementById('postSubmissionForm').addEventListener('submit', handleNewFormSubmission);

    document.getElementById("updateLocationButton").addEventListener("click", function () {
        const newLocation = document.getElementById("newLocation").value.trim();
        if (newLocation) {
            updateLocation(newLocation);
        } else {
            displayMessage(positionMessageContainer, "Vennligst skriv inn en gyldig adresse.", true);
        }
    });

    document.getElementById('uploadTrigger').addEventListener('click', function() {
        document.getElementById('profilePicture').click();
    });

    document.getElementById('profilePicture').addEventListener('change', handleProfilePictureChange);

    loadUserProfile();
    loadAndDisplayUserPosts();
});

function updateLocation(newLocation) {
    const titleCasedLocation = toTitleCase(newLocation);
    fetch("https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ location: titleCasedLocation }),
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to update location on server");
        return response.json();
    })
    .then(data => {
        document.getElementById("userLocation").textContent = titleCasedLocation;
        updateEmbeddedMap(titleCasedLocation);
        displayMessage(positionMessageContainer, "Posisjon oppdatert!");
    })
    .catch(error => {
        console.error("Error:", error);
        displayMessage(positionMessageContainer, "Feil ved oppdatering av posisjon", true);
    });
}

function handleNewFormSubmission(event) {
    event.preventDefault(); 
    const formData = new FormData(event.target);

    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/submit-post', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        displayMessage(createPostMessageContainer, "Innlegg lagt til!");
        loadAndDisplayUserPosts(); // Reload the posts to include the new one
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage(createPostMessageContainer, "Kunne ikke legge til innlegg.", true);
    });
}

function handleProfilePictureChange(event) {
    const file = event.target.files[0];
    if (!file) {
        displayMessage(positionMessageContainer, "Ingen fil valgt.", true);
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
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    })
    .then(data => {
        const profileImage = document.getElementById('profile_picture');
        profileImage.src = URL.createObjectURL(file);
        profileImage.alt = 'Profile picture';
        displayMessage(positionMessageContainer, "Profilbilde oppdatert!");
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage(positionMessageContainer, "Kunne ikke laste opp bildet.", true);
    });
}

function loadUserProfile() {
    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
    .then(response => {
        if (!response.ok) throw new Error('Autentisering feilet, vennligst logg inn på nytt.');
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
        profileImgElement.src = profile.userPicture || '/images/no-profile.png';
        profileImgElement.alt = 'User profile picture';

        updateEmbeddedMap(profile.location);
    })
    .catch(error => {
        console.error('Error:', error);
        redirectToLogin(error.message);
    });
}

function loadAndDisplayUserPosts() {
    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-posts/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('userPostsContainer');
        if (posts.length === 0) {
            displayMessage(myPostsMessageContainer, "Ingen innlegg å vise.", true);
            return;
        }

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
        displayMessage(myPostsMessageContainer, "Kunne ikke hente innlegg.", true);
    });
}

function redirectToLogin(message) {
    localStorage.setItem("redirectMessage", message);
    window.location.href = "/html/logginn.html";
}
