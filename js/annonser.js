// Function to determine the class based on the category
function getCategoryClass(category) {
  const categoryClasses = {
    Strikking: "category-strikking",
    Søm: "category-søm",
    Hekling: "category-hekling",
    Brodering: "category-brodering",
    Veving: "cateogry-veving",
  };
  return categoryClasses[category] || "";
}

document.addEventListener("DOMContentLoaded", function () {
  loadAndDisplayAllPosts();
});
//Load all posts DOM
function loadAndDisplayAllPosts() {
  fetch(
    "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/all-posts/",
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((posts) => {
      const postsContainer = document.getElementById("allPostsContainer");
      postsContainer.innerHTML = "";

      posts.forEach((post) => {
        const categoryClass = getCategoryClass(post.main_category);

        const postElement = `
                    <div class="post">
                        <img src="${post.image_url}" alt="${post.title}">
                        <div class="post-content flex-column space-between w-100">
                            <h3 class="post-title">${post.title}</h3>
                            <p class="post-description">${post.description}</p>
                            <div class="category-container flex space-between">
                                <p class="post-category">
                                    <span class="category-main ${categoryClass}">${
          post.main_category || "Ikke spesifisert"
        }</span>
                                    <span class="category-sub">${
                                      post.subcategory || "Ikke spesifisert"
                                    }</span>
                                </p>
                                <button class="read-more">Les mer</button>
                            </div>
                        </div>
                    </div>
                `;
        postsContainer.innerHTML += postElement;
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
