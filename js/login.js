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
                // Redirect or show a success message
                window.location.href = '/dashboard'; // Redirect to the dashboard
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
