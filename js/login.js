document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(loginForm);

        // Make an AJAX POST request to the custom login endpoint
        fetch('/wp-json/myapp/v1/login/', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Authentication successful') {
                // Redirect to a success page or perform other actions
                window.location.href = '/success-page/';
            } else {
                // Display an error message to the user
                alert('Login failed. Please check your credentials.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});