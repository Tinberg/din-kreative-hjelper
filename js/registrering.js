document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".create-user-form form");
    const messageContainer = document.getElementById("successMessageContainer");

    //Handles the submission of the user registration form.
    //It collects user data from the form, sends it to a server endpoint
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const userData = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            
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
                messageContainer.innerHTML = `<p class="success-message">Bruker er opprettet. Vennligst logg inn.</p>`;
                
                // Create a new button element
                const loginButton = document.createElement("button");
                loginButton.textContent = "Til innlogging";
                loginButton.addEventListener("click", function() {
                    window.location.href = '/html/logg-inn.html';
                });

               
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
});
