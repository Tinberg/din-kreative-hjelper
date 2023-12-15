document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        redirectToLogin("Vennligst logg inn for å se din profil.");
    }

    const headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    });

    try {
        const response = await fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile', { headers });

        if (!response.ok) {
            throw new Error('Autentisering feilet, vennligst logg inn på nytt.');
        }

        const data = await response.json();

        if (data.username) {
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            const productsDiv = document.getElementById('products');
            data.products_for_sale.forEach(product => {
                const productElement = document.createElement('div');
                productElement.textContent = product.name;
                productsDiv.appendChild(productElement);
            });
        }
    } catch (error) {
        console.error('Error:', error);
        redirectToLogin(error.message);
    }

    function redirectToLogin(message) {
        localStorage.setItem('redirectMessage', message);
        window.location.href = '/html/logginn.html';
    }
});
