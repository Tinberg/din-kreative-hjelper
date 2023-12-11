document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const loginData = {
            username_or_email: formData.get("username_or_email"),
            password: formData.get("password"),
        };

        const targetUrl = "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/login/";

        fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify(loginData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Authentication successful') {
                console.log("User logged in successfully", data);
                // Handle login success (e.g., redirect to another page)
            } else {
                console.error("Login error", data);
                // Display login errors to the user
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});
