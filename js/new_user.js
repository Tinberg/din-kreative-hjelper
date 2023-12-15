
//-----Create user function
document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.querySelector("#registrationForm");

    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(registrationForm);
        const userData = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
        };

        const registrationUrl = "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/register/";

        fetch(registrationUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.user_id) {
                displaySuccessMessage("User created successfully. Please proceed to login.");
            } else {
                displayErrorMessage("Error creating user: " + data.message);
            }
        })
        .catch(error => displayErrorMessage("Network error: " + error.message));
    });
});

function displaySuccessMessage(message) {
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = `<p class="success-message">${message}</p>`;
    const proceedButton = document.createElement("button");
    proceedButton.textContent = "Proceed to Login";
    proceedButton.onclick = function() {
        window.location.href = '/html/login.html';
    };
    messageContainer.appendChild(proceedButton);
}

function displayErrorMessage(message) {
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = `<p class="error-message">${message}</p>`;
}




//------Create a button and display the message from create user function