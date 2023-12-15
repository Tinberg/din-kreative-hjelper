
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".create-user-form form");

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
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.user_id) {
                console.log("User created successfully", data);
                // Display a success message and a button
                displaySuccessMessageAndButton("User created successfully. Please log in.");
            } else {
                console.error("Error creating user", data);
                // Handle error
            }
        })
        .catch(error => console.error("Error:", error));
    });

    function displaySuccessMessageAndButton(message) {
        const container = document.getElementById('successMessageContainer');
        container.innerHTML = `
            <p>${message}</p>
            <button onclick="location.href='/html/login.html'">Go to Login</button>
        `;
        // Optionally, add styles to your message and button
    }
});
