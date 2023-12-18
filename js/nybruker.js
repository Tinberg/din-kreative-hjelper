//Handles the submission of the user registration form.
//It collects user data from the form, sends it to a server endpoint
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const userData = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        location: formData.get("location"),
    };

    const targetUrl = "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/register/";

    fetch(targetUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(userData),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.user_id) {
            // Store the location in the user's profile
            updateLocationInProfile(userData.location);

            messageContainer.innerHTML = `<p class="success-message">Bruker er opprettet. Vennligst logg inn.</p>`;
            
            // Create a new button element
            const loginButton = document.createElement("button");
            loginButton.textContent = "Til innlogging";
            loginButton.addEventListener("click", function() {
                window.location.href = '/html/logginn.html';
            });

            // Append the button to the message container
            messageContainer.appendChild(loginButton);

            form.reset();
        } else {
            let errorMessage = "En feil oppstod. Vennligst prøv igjen eller kontakt support hvis problemet vedvarer.";
            if (data.code === "user_exists") {
                errorMessage = "Brukernavn eller e-post eksisterer allerede. Vennligst prøv en annen.";
            }
            messageContainer.innerHTML = `<p class="error-message">${errorMessage}</p>`;
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        messageContainer.innerHTML = `<p class="error-message">Vi opplever tekniske problemer. Vennligst prøv igjen senere eller kontakt support.</p>`;
    });
});

// Function to update the user's location in their profile
function updateLocationInProfile(location) {
    const token = localStorage.getItem('jwt_token'); // You may need to adjust how you retrieve the token
    if (token) {
        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        });

        const updateLocationData = {
            location: location
        };

        // Make a request to update the location in the user's profile
        fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(updateLocationData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update location in user profile');
            }
            // Location updated successfully in the user's profile
        })
        .catch(error => {
            console.error('Error updating location in user profile:', error);
            // Handle the error here
        });
    }
}
