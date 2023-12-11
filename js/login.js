document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(loginForm);

        // Define the CORS proxy URL
        const corsAnywhereUrl = "https://noroffcors.onrender.com/";

        // Specify your WordPress login endpoint URL
        const loginEndpoint = "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/login/";

        // Send a POST request using the CORS proxy
        fetch(corsAnywhereUrl + loginEndpoint, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Authentication successful') {
                // Display a success message
                alert('Login successful!'); // Show a JavaScript alert

                // Optionally, you can add additional logic here, such as updating the UI or performing other actions.
            } else {
                // Display an error message
                alert('Login failed. Please check your credentials.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
