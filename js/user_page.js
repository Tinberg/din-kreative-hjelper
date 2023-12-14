// document.addEventListener("DOMContentLoaded", function () {
//     // Fetch user profile data
//     fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile', {
//         credentials: 'include' // Include credentials in the request
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             if (data.username) {
//                 // Display username, email, and products
//                 document.getElementById('username').textContent = data.username;
//                 document.getElementById('email').textContent = data.email;
//                 // Assuming you have a div for products
//                 const productsDiv = document.getElementById('products');
//                 data.products_for_sale.forEach(product => {
//                     // Create and append elements for each product
//                     // Modify this according to how you want to display products
//                     const productElement = document.createElement('div');
//                     productElement.textContent = product.name; // Adjust based on your product structure
//                     productsDiv.appendChild(productElement);
//                 });
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/check-session', {
//         credentials: 'include' // Include credentials in the request
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status !== 'authenticated') { 
//                 // window.location.href = '/html/login.html';
//             }
//             // User is authenticated, continue with page-specific logic
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// });



document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = '/html/login.html'; // Redirect to login if no token
        return;
    }

    const headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    });

    // Fetch user profile data
    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile', { headers })
    .then(response => response.json())
    .then(data => {
        // Existing code to handle user data...
    })
    .catch(error => console.error('Error:', error));

    // Check session
    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/check-session', { headers })
    .then(response => response.json())
    .then(data => {
        if (data.status !== 'authenticated') {
            window.location.href = '/html/login.html';
        }
        // User is authenticated, continue with page-specific logic
    })
    .catch(error => console.error('Error:', error));
});
