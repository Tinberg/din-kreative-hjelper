document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    if (postId) {
        fetch(`https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/post/${postId}`, { method: "GET" })
            .then(response => response.json())
            .then(post => {
                // Assuming 'post' is the object with all the details
                document.getElementById('postTitle').innerText = post.title || 'No title';
                document.getElementById('postImage').src = post.image_url || '';
                document.getElementById('postImage').alt = post.title || 'Post Image';
                document.getElementById('postCategory').innerText = post.main_category || 'No category';
                document.getElementById('postSubcategory').innerText = post.subcategory || 'No subcategory';
                document.getElementById('postDescription').innerText = post.description || 'No description';
                
                // User info
                document.getElementById('userProfilePicture').src = post.profile_picture || '';
                document.getElementById('userProfilePicture').alt = post.username || 'User Profile';
                document.getElementById('username').innerText = post.username || 'Anonymous';
                document.getElementById('userLocation').innerText = post.location || 'No location';

                // Update embedded Google Map based on user's location
                updateEmbeddedMap(post.location);

                // Handle clickable username if needed
                // document.getElementById('username').addEventListener('click', function() {
                //     window.location.href = `userprofile.html?userId=${post.author_id}`;
                // });
            })
            .catch(error => {
                console.error("Failed to load post:", error);
                // Handle errors or show a message to the user
            });
    } else {
        // No postId found in URL
        console.error("No post ID found in the URL.");
        // Redirect back to main page or show a message
    }
});

// Function to update the embedded map
function updateEmbeddedMap(address) {
    const embeddedMap = document.getElementById("embeddedMap");

    if (address) {
        // Check if address is non-empty and valid
        const formattedAddress = encodeURIComponent(address);
        embeddedMap.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyASJpumfzHiVTp3ATgQA7AXrS-E1-zdRzo&q=${formattedAddress}`;
        embeddedMap.style.display = 'block'; // Make sure the map is visible
    } else {
        // If the address is invalid, hide the map
        embeddedMap.style.display = 'none';
    }
}
