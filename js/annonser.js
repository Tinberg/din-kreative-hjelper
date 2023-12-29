//function to show all posts
document.addEventListener("DOMContentLoaded", function () {
    loadAndDisplayAllPosts();
});

function loadAndDisplayAllPosts() {
    fetch('https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/all-posts/', {
        method: 'GET',
        // No need for authorization if public
    })
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('allPostsContainer');
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = `
                <div class="post">
                    <h3>${post.title}</h3>
                    <img src="${post.image_url}" alt="${post.title}">
                    <p class="category">Kategori: ${post.main_category || 'Ikke spesifisert'}, Underkategori: ${post.subcategory || 'Ikke spesifisert'}</p>
                    <p>${post.description}</p>
                </div>
            `;
            postsContainer.innerHTML += postElement;
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}