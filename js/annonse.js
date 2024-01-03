document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    if (postId) {
        fetch(`https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/post/${postId}`, { method: "GET" })
            .then(response => response.json())
            .then(post => {
                // Assuming 'post' is the object with all the details
                const postImage = document.getElementById('postImage');
                postImage.src = post.image_url || '';
                postImage.alt = post.title || 'Post Image';
                
                document.getElementById('postTitle').innerText = post.title || 'No title';
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

                // Apply dominant background color once the image is loaded
                if (postImage.complete) {
                    applyDominantBackgroundColor(postImage);
                } else {
                    postImage.addEventListener('load', function() {
                        applyDominantBackgroundColor(postImage);
                    });
                }
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
        const formattedAddress = encodeURIComponent(address);
        embeddedMap.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyASJpumfzHiVTp3ATgQA7AXrS-E1-zdRzo&q=${formattedAddress}`;
        embeddedMap.style.display = 'block';
    } else {
        embeddedMap.style.display = 'none';
    }
}

// Function to apply the dominant background color from the image
function applyDominantBackgroundColor(img) {
    if (window.ColorThief) {
        const colorThief = new ColorThief();
        // Ensure the image is loaded
        if (img.complete && img.naturalHeight !== 0) {
            try {
                const dominantColor = colorThief.getColor(img);
                const rgb = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
                
                const imgContainer = document.querySelector('.post-image-container');
                if (imgContainer) {
                    imgContainer.style.backgroundColor = rgb;
                }
            } catch (e) {
                console.error("Error extracting color from image: ", e);
            }
        }
    } else {
        console.error("ColorThief is not loaded.");
    }
}
