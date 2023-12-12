document.addEventListener("DOMContentLoaded", function () {
    // Fetch user profile data
    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile/', {
        credentials: 'include' // Include credentials in the request
    })
        .then(response => response.json())
        .then(data => {
            console.log('User profile data:', data);
            if (data.username) {
                // Display username, email, and products
                document.getElementById('username').textContent = data.username;
                document.getElementById('email').textContent = data.email;
                // Assuming you have a div for products
                const productsDiv = document.getElementById('products');
                data.products_for_sale.forEach(product => {
                    // Create and append elements for each product
                    // Modify this according to how you want to display products
                    const productElement = document.createElement('div');
                    productElement.textContent = product.name; // Adjust based on your product structure
                    productsDiv.appendChild(productElement);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.addEventListener("DOMContentLoaded", function () {
    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/check-session', {
        credentials: 'include' // Include credentials in the request
    })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'authenticated') {
               
            }
            // User is authenticated, continue with page-specific logic
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
