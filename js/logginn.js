document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login-form");
    const errorMessageContainer = document.getElementById('errorMessage');
    const redirectMessage = localStorage.getItem('redirectMessage');

    if (redirectMessage) {
        errorMessageContainer.textContent = redirectMessage;
        localStorage.removeItem('redirectMessage');
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        errorMessageContainer.textContent = '';

        const formData = new FormData(form);
        const loginData = {
            username: formData.get("username_or_email").toLowerCase(),
            password: formData.get("password"),
        };

        const targetUrl = "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/jwt-auth/v1/token";

        fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(loginData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Feil brukernavn, e-post eller passord. Vennligst prøv igjen.');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('jwt_token', data.token);
                window.location.href = '/html/brukerside.html';
            })
            .catch(error => {
                console.error("Error:", error);
                errorMessageContainer.textContent = error.message;
            });
    });
});


  

