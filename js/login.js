


document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

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
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                console.log("User logged in successfully", data);
                localStorage.setItem('jwt_token', data.token); // Store the JWT token
                window.location.href = '/html/user_page.html';
            } else {
                console.error("Login error", data);
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
