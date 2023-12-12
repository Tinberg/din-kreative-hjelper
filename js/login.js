// document.addEventListener("DOMContentLoaded", function () {
//   const form = document.querySelector(".login-form");

//   form.addEventListener("submit", function (event) {
//     event.preventDefault();

//     const formData = new FormData(form);
//     const loginData = {
//       username_or_email: formData.get("username_or_email").toLowerCase(),
//       password: formData.get("password"),
//     };
//     console.log("Login Data - username_or_email:", loginData.username_or_email);
//     // CORS Proxy URL
//     const corsAnywhereUrl = "https://noroffcors.onrender.com/";

//     // Target URL for the login endpoint
//     const targetUrl =
//       "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/login/";

//     // Using CORS Proxy for the fetch request
//     fetch(corsAnywhereUrl + targetUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "X-Requested-With": "XMLHttpRequest",
//       },
//       body: JSON.stringify(loginData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.message === "Authentication successful") {
//           console.log("User logged in successfully", data);
//           // Handle login success (e.g., redirect to another page)
//         } else {
//           console.error("Login error", data);
//           // Display login errors to the user
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const loginData = {
            username_or_email: formData.get("username_or_email").toLowerCase(),
            password: formData.get("password"),
        };

        const targetUrl = "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/login/";

        fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify(loginData),
            credentials: 'same-origin' // Include credentials in the request
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Authentication successful") {
                console.log("User logged in successfully", data);
                window.location.href = '/html/user_page.html';
            } else {
                console.error("Login error", data);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    });
});

