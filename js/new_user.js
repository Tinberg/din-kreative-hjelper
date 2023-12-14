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

        const targetUrl = "https://cms.kreativehjelpere.no//wp-json/myapp/v1/register/";

        fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify(userData),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.user_id) {
                console.log("User created successfully", data);
                // Handle success (e.g., redirect to login page or show success message)
            } else {
                console.error("Error creating user", data);
                // Handle errors (e.g., show error message to the user)
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    });
});
