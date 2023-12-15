document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('jwt_token');
    
    // Retrieve the user's location from localStorage or use an empty string if not found
    const userLocation = localStorage.getItem('userLocation') || "";

    // Check if the JWT token exists (user is authenticated)
    if (!token) {
        redirectToLogin("Vennligst logg inn for å se din profil.");
        return;
    }

    // Set headers for the fetch request, including the JWT token
    const headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    });

    // Fetch the user profile data from the server
    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile', { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error('Autentisering feilet, vennligst logg inn på nytt.');
            }
            return response.json();
        })
        .then(data => {
            if (data.username) {
                // Display the user's username and email
                document.getElementById('username').textContent = `Username: ${data.username}`;
                document.getElementById('email').textContent = `Email: ${data.email}`;
                
                // Display the user's location
                const locationElement = document.getElementById("userLocation");
                if (locationElement) {
                    locationElement.textContent = `Your Location: ${userLocation}`;
                }

                // Display the user's products for sale
                const productsDiv = document.getElementById('products');
                data.products_for_sale.forEach(product => {
                    const productElement = document.createElement('div');
                    productElement.textContent = `Product Name: ${product.name}`;
                    productsDiv.appendChild(productElement);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            redirectToLogin(error.message);
        });

    function redirectToLogin(message) {
        localStorage.setItem('redirectMessage', message);
        window.location.href = '/html/logginn.html';
    }
});
