// // Function to determine the class based on the category
// function getCategoryClass(category) {
//   const categoryClasses = {
//     Strikking: "category-strikking",
//     Søm: "category-søm",
//     Hekling: "category-hekling",
//     Brodering: "category-brodering",
//     Veving: "category-veving",
//   };
//   return categoryClasses[category] || "";
// }

// document.addEventListener("DOMContentLoaded", function () {
//   loadAndDisplayAllPosts();
// });
// //Load all posts DOM
// function loadAndDisplayAllPosts() {
//   fetch(
//     "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/all-posts/",
//     {
//       method: "GET",
//     }
//   )
//     .then((response) => response.json())
//     .then((posts) => {
//       const postsContainer = document.getElementById("allPostsContainer");
//       postsContainer.innerHTML = "";

//       posts.forEach((post) => {
//         const categoryClass = getCategoryClass(post.main_category);

//         const postElement = `
//         <div class="post border-r">
//         <div class="post-image-container">
//           <img src="${post.image_url}" alt="${post.title}" class="post-img">
//         </div>
//         <div class="post-content flex-column space-between w-100">
//           <h3 class="post-title">${post.title}</h3>
//           <p class="post-description">${post.description}</p>
//           <div class="category-container flex space-between">
//             <p class="post-category">
//               <span class="category-main ${categoryClass}">${post.main_category || "Ikke spesifisert"}</span>
//               <span class="category-sub">${post.subcategory || "Ikke spesifisert"}</span>
//             </p>
//             <button class="read-more">Les mer</button>
//           </div>
//         </div>
//       </div>
      
//                 `;
//         postsContainer.innerHTML += postElement;
//       });
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }


function getCategoryClass(category) {
    const categoryClasses = {
        Strikking: "category-strikking",
        Søm: "category-søm",
        Hekling: "category-hekling",
        Brodering: "category-brodering",
        Veving: "category-veving",
    };
    return categoryClasses[category] || "";
}

// Function to apply filters and reload posts
function applyFilters() {
    const selectedMainCategory = document.querySelector('.category-title.active')?.dataset?.category || '';
    const selectedSubCategory = document.querySelector('.subcategory-list .active')?.dataset?.category || '';
    loadAndDisplayAllPosts(selectedMainCategory, selectedSubCategory);
}

// Function to load and display posts filtered by the main category and subcategory
function loadAndDisplayAllPosts(mainCategory = '', subcategory = '') {
    let url = "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/all-posts/";
    let queryParams = [];

    // Construct query parameters based on selected filters
    if (mainCategory) queryParams.push(`main_category=${encodeURIComponent(mainCategory)}`);
    if (subcategory) queryParams.push(`subcategory=${encodeURIComponent(subcategory)}`);
    if (queryParams.length) url += `?${queryParams.join('&')}`;

    // Fetch and display posts
    fetch(url, { method: "GET" })
        .then((response) => response.json())
        .then((posts) => {
            const postsContainer = document.getElementById("allPostsContainer");
            postsContainer.innerHTML = "";

            posts.forEach((post) => {
                // Create a post element for each post
                const categoryClass = getCategoryClass(post.main_category);
                const postElement = `
                    <div class="post border-r">
                        <div class="post-image-container">
                            <img src="${post.image_url}" alt="${post.title}" class="post-img">
                        </div>
                        <div class="post-content flex-column space-between w-100">
                            <h3 class="post-title">${post.title}</h3>
                            <p class="post-description">${post.description}</p>
                            <div class="category-container flex space-between">
                                <p class="post-category">
                                    <span class="category-main ${categoryClass}">${post.main_category || "Ikke spesifisert"}</span>
                                    <span class="category-sub">${post.subcategory || "Ikke spesifisert"}</span>
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

document.addEventListener("DOMContentLoaded", function () {
     // "Show All" button click event
     const showAllButton = document.querySelector('.show-all'); 
     if (showAllButton) {
         showAllButton.addEventListener('click', function () {
             document.querySelectorAll('.category-title, .subcategory-list .border-r').forEach(btn => {
                 btn.classList.remove('active');
             });
 
             loadAndDisplayAllPosts(); 
         });
     }
    // Main category click event
    document.querySelectorAll('.category-title').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.subcategory-list .border-r').forEach(btn => {
                btn.classList.remove('active'); 
            });
            document.querySelectorAll('.category-title').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active'); 
            applyFilters();
        });
    });

    // Subcategory click event
    document.querySelectorAll('.subcategory-list .border-r').forEach(button => {
        button.addEventListener('click', function () {
            const parentCategoryElement = this.closest('.category');
            if (parentCategoryElement) {
                const mainCategoryButton = parentCategoryElement.querySelector('.category-title');

                if (mainCategoryButton) {
                    const mainCategory = mainCategoryButton.dataset.category;

                    document.querySelectorAll('.category-title').forEach(btn => btn.classList.remove('active'));
                    mainCategoryButton.classList.add('active');

                    document.querySelectorAll('.subcategory-list .border-r').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active'); 

                    applyFilters();
                }
            }
        });
    });

    loadAndDisplayAllPosts();
});
