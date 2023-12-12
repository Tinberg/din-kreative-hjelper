document.addEventListener("DOMContentLoaded", function() {
    const corsAnywhereUrl = "https://noroffcors.onrender.com/";
    const userProfileUrl = 'https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile/';

    // Fetch user profile data
    fetch(corsAnywhereUrl + userProfileUrl)
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          // Display username, email, and products
          document.getElementById('username').textContent = data.username;
          document.getElementById('email').textContent = data.email;
          const productsDiv = document.getElementById('products');
          data.products_for_sale.forEach(product => {
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

document.addEventListener("DOMContentLoaded", function() {
    const corsAnywhereUrl = "https://noroffcors.onrender.com/";
    const checkSessionUrl = 'https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/check-session';

    // Check user session
    fetch(corsAnywhereUrl + checkSessionUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status !== 'authenticated') {
          window.location.href = '/login-page.html';
        }
        // User is authenticated, continue with page-specific logic
      })
      .catch(error => {
        console.error('Error:', error);
      });
});
