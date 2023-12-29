
//--------- Fetching username, email, location, and profile picture. (update location and upload profile picture) ---------//

// document.addEventListener("DOMContentLoaded", function () {
//   token = localStorage.getItem("jwt_token");

//   if (!token) {
//     redirectToLogin("Vennligst logg inn for å se din profil.");
//     return;
//   }

//   const profile = {
//     username: "",
//     email: "",
//     location: "",
//     userPicture: "",
//   };

//   // Function to show messages
//   function showMessage(elementId, message, isSuccess) {
//     const messageElement = document.getElementById(elementId);
//     messageElement.textContent = message;
//     if (isSuccess) {
//       messageElement.classList.remove("error-message");
//       messageElement.classList.add("success-message");
//     } else {
//       messageElement.classList.remove("success-message");
//       messageElement.classList.add("error-message");
//     }
//     clearMessageAfterDelay(messageElement);
//   }

//   // Function to update the embedded map
//   function updateEmbeddedMap(address) {
//     const embeddedMap = document.getElementById("embeddedMap");

//     if (address) {
//         // Check if address is non-empty and valid
//         const formattedAddress = encodeURIComponent(address);
//         embeddedMap.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyASJpumfzHiVTp3ATgQA7AXrS-E1-zdRzo&q=${formattedAddress}`;
//         embeddedMap.style.display = 'block'; // Make sure the map is visible
//     } else {
//         // If the address is invalid, hide the map
//         embeddedMap.style.display = 'none';
//     }
// }

//   // Function to clear the message after a delay
//   let messageTimeout;  

//   function clearMessageAfterDelay(element, delay = 15000) {
//       clearTimeout(messageTimeout);
  
//       messageTimeout = setTimeout(() => {
//           element.innerHTML = "";
//       }, delay);
//   }

//   // Function to transform text to title case
//   function toTitleCase(str) {
//     return str.replace(/\w\S*/g, function (txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
//   }

//   // Function to handle the submission of the new form
//   function handleNewFormSubmission(event) {
//     event.preventDefault();

//     const formData = new FormData();
//     formData.append("title", document.getElementById("title").value);
//     formData.append(
//       "description",
//       document.getElementById("description").value
//     );
//     formData.append("image", document.getElementById("image").files[0]);

//     fetch(
//       "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/submit-post",
//       {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       }
//     )
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok.");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("Success:", data);
//         showMessage("createPostMessage", "Innlegg lagt til!", true);

//         document.getElementById("title").value = "";
//         document.getElementById("description").value = "";
//         document.getElementById("image").value = "";

//         loadAndDisplayUserPosts();
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         showMessage(
//           "createPostMessage",
//           "Vennligst sørg for at alle felt er fullstendig utfylt før du publiserer innlegget. Prøv igjen. Hvis problemet vedvarer, kontakt oss på post@meah.design.",
//           false
//         );
//       });
//   }

//   document
//     .getElementById("postSubmissionForm")
//     .addEventListener("submit", handleNewFormSubmission);

//   // Function to load user profile and update UI
//   function loadUserProfile() {
//     fetch(
//       "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile/",
//       {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       }
//     )
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Autentisering feilet, vennligst logg inn på nytt.");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         profile.username = data.username;
//         profile.email = data.email;
//         profile.location = toTitleCase(data.location);
//         profile.userPicture = data.profile_picture;

//         document.getElementById("username").textContent = profile.username;
//         document.getElementById("email").textContent = profile.email;
//         document.getElementById("userLocation").textContent = profile.location;

//         const profileImgElement = document.getElementById("profile_picture");
//         if (profile.userPicture) {
//           profileImgElement.src = profile.userPicture;
//         } else {
//           profileImgElement.src = "/images/no-profile.png";
//         }

//         updateEmbeddedMap(profile.location);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         redirectToLogin(error.message);
//       });
//   }

//   // Function to update location
//   document.getElementById("updateLocationButton").addEventListener("click", function () {
//     const newLocation = document.getElementById("newLocation").value;
//     const titleCasedLocation = toTitleCase(newLocation);

//     fetch("https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + token,
//         },
//         body: JSON.stringify({ location: titleCasedLocation }),
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error("Failed to update location on server");
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log("Success:", data);
//         profile.location = titleCasedLocation;
//         document.getElementById("userLocation").textContent = titleCasedLocation;
//         updateEmbeddedMap(titleCasedLocation); // Update the map

//         // Show the success message only after user changes the address
//         showMessage("positionMessage", "Posisjon oppdatert! Vennligst bekreft at din nåværende posisjon samsvarer med kartet, og at all informasjon, inkludert adresse, by eller sted, er riktig og oppdatert", true);
//     })
//     .catch(error => {
//         console.error("Error:", error);
//         showMessage("positionMessage", "Feil ved oppdatering av posisjon, prøv igjen: " + error.message, false);
//         updateEmbeddedMap(""); // Hide the map as the address is invalid
//     });
// });


//   function redirectToLogin(message) {
//     localStorage.setItem("redirectMessage", message);
//     window.location.href = "/html/logginn.html";
//   }

//   // Handle file selection and upload profile img
//   document.getElementById("uploadTrigger").addEventListener("click", () => {
//     document.getElementById("profilePicture").click();
//   });

//   document
//     .getElementById("profilePicture")
//     .addEventListener("change", function (event) {
//       const file = event.target.files[0];
//       if (!file) {
//         return;
//       }

//       const formData = new FormData();
//       formData.append("profile_picture", file);

//       fetch(
//         "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-profile-picture",
//         {
//           method: "POST",
//           body: formData,
//           headers: {
//             Authorization: "Bearer " + token,
//           },
//         }
//       )
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Network response was not ok.");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           const reader = new FileReader();
//           reader.onload = function (e) {
//             const profileImage = document.getElementById("profile_picture");
//             profileImage.src = e.target.result;
//           };
//           reader.readAsDataURL(file);
//         })
//         .catch((error) => {
//           console.error(
//             "There has been a problem with your fetch operation:",
//             error
//           );
//           alert("Bildet kunne ikke lastes opp. Vennligst prøv igjen.");
//         });
//     });

//   // Function to load and display user posts
//   function loadAndDisplayUserPosts() {
//     if (!token) return;
//     fetch(
//       "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-posts/",
//       {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       }
//     )
//       .then((response) => response.json())
//       .then((posts) => {
//         const postsContainer = document.getElementById("userPostsContainer");
//         postsContainer.innerHTML = "";

//         if (posts.length === 0) {
//           showMessage("myPosts", "Ingen innlegg funnet.", false);
//           return; // Exit the function early since there are no posts to display
//         }

//         posts.forEach((post) => {
//           const postElement = `
//                 <div class="post">
//                     <h3>${post.title}</h3>
//                     <img src="${post.image_url}" alt="${post.title}">
//                     <p>${post.description}</p>
//                 </div>
//             `;
//           postsContainer.innerHTML += postElement;
//         });

//         // This message will only show if posts are successfully loaded and displayed
//         showMessage("myPosts", "Innlegg lastet!", true);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         showMessage(
//           "myPosts",
//           "Kunne ikke laste innlegg: " + error.message,
//           false
//         );
//       });
//   }

//   loadUserProfile();
//   loadAndDisplayUserPosts();
// });


document.addEventListener("DOMContentLoaded", function () {
  token = localStorage.getItem("jwt_token");

  if (!token) {
    redirectToLogin("Vennligst logg inn for å se din profil.");
    return;
  }

  const profile = {
    username: "",
    email: "",
    location: "",
    userPicture: "",
  };

  const categoryMapping = {
    "Søm": ["Reperasjon", "Tilpassing", "Nytt & håndlaget"],
    "Strikking": ["Reperasjon", "Tilpassing", "Nytt & håndlaget"],
    "Hekling": ["Reperasjon", "Tilpassing", "Nytt & håndlaget"],
    "Brodering": ["Reperasjon", "Nytt & håndlaget"],
    "Veving": ["Reperasjon", "Nytt & håndlaget"]
  };

  // Function to show messages
  function showMessage(elementId, message, isSuccess) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
    if (isSuccess) {
      messageElement.classList.remove("error-message");
      messageElement.classList.add("success-message");
    } else {
      messageElement.classList.remove("success-message");
      messageElement.classList.add("error-message");
    }
    clearMessageAfterDelay(messageElement);
  }

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

  // Function to clear the message after a delay
  let messageTimeout;  

  function clearMessageAfterDelay(element, delay = 15000) {
      clearTimeout(messageTimeout);
  
      messageTimeout = setTimeout(() => {
          element.innerHTML = "";
      }, delay);
  }

  // Function to transform text to title case
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  // Function to handle the submission of the new form
  function handleNewFormSubmission(event) {
    event.preventDefault();
    //title and desciption
    const formData = new FormData();
    formData.append("title", document.getElementById("title").value);
    formData.append(
      "description",
      document.getElementById("description").value
    );
    //img
    formData.append("image", document.getElementById("image").files[0]);
    //Categories
    formData.append("category", document.getElementById("category").value);
    formData.append("subcategory", document.getElementById("subcategory").value);

    fetch(
      "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/submit-post",
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        showMessage("createPostMessage", "Innlegg lagt til!", true);

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("image").value = "";

        loadAndDisplayUserPosts();
      })
      .catch((error) => {
        console.error("Error:", error);
        showMessage(
          "createPostMessage",
          "Vennligst sørg for at alle felt er fullstendig utfylt før du publiserer innlegget. Prøv igjen. Hvis problemet vedvarer, kontakt oss på post@meah.design.",
          false
        );
      });
  }

  const categorySelect = document.getElementById("category");
  const subcategorySelect = document.getElementById("subcategory");

  categorySelect.addEventListener("change", function () {
    const selectedCategory = this.value;
    const subcategories = categoryMapping[selectedCategory] || [];

    // Clear previous subcategories
    subcategorySelect.innerHTML = '<option value="">Velg en underkategori...</option>';
    // Populate new subcategories
    subcategories.forEach(subcategory => {
      const option = document.createElement("option");
      option.value = subcategory;
      option.textContent = subcategory;
      subcategorySelect.appendChild(option);
    });
  });

  document
    .getElementById("postSubmissionForm")
    .addEventListener("submit", handleNewFormSubmission);

  // Function to load user profile and update UI
  function loadUserProfile() {
    fetch(
      "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-profile/",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Autentisering feilet, vennligst logg inn på nytt.");
        }
        return response.json();
      })
      .then((data) => {
        profile.username = data.username;
        profile.email = data.email;
        profile.location = toTitleCase(data.location);
        profile.userPicture = data.profile_picture;

        document.getElementById("username").textContent = profile.username;
        document.getElementById("email").textContent = profile.email;
        document.getElementById("userLocation").textContent = profile.location;

        const profileImgElement = document.getElementById("profile_picture");
        if (profile.userPicture) {
          profileImgElement.src = profile.userPicture;
        } else {
          profileImgElement.src = "/images/no-profile.png";
        }

        updateEmbeddedMap(profile.location);
      })
      .catch((error) => {
        console.error("Error:", error);
        redirectToLogin(error.message);
      });
  }

  // Function to update location
  document.getElementById("updateLocationButton").addEventListener("click", function () {
    const newLocation = document.getElementById("newLocation").value;
    const titleCasedLocation = toTitleCase(newLocation);

    fetch("https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-location", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ location: titleCasedLocation }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update location on server");
        }
        return response.json();
    })
    .then(data => {
        console.log("Success:", data);
        profile.location = titleCasedLocation;
        document.getElementById("userLocation").textContent = titleCasedLocation;
        updateEmbeddedMap(titleCasedLocation); // Update the map

        // Show the success message only after user changes the address
        showMessage("positionMessage", "Posisjon oppdatert! Vennligst bekreft at din nåværende posisjon samsvarer med kartet, og at all informasjon, inkludert adresse, by eller sted, er riktig og oppdatert", true);
    })
    .catch(error => {
        console.error("Error:", error);
        showMessage("positionMessage", "Feil ved oppdatering av posisjon, prøv igjen: " + error.message, false);
        updateEmbeddedMap(""); // Hide the map as the address is invalid
    });
});


  function redirectToLogin(message) {
    localStorage.setItem("redirectMessage", message);
    window.location.href = "/html/logg-inn.html";
  }

  // Handle file selection and upload profile img
  document.getElementById("uploadTrigger").addEventListener("click", () => {
    document.getElementById("profilePicture").click();
  });

  document
    .getElementById("profilePicture")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append("profile_picture", file);

      fetch(
        "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/update-profile-picture",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          return response.json();
        })
        .then((data) => {
          const reader = new FileReader();
          reader.onload = function (e) {
            const profileImage = document.getElementById("profile_picture");
            profileImage.src = e.target.result;
          };
          reader.readAsDataURL(file);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
          alert("Bildet kunne ikke lastes opp. Vennligst prøv igjen.");
        });
    });

  // Function to load and display user posts
  function loadAndDisplayUserPosts() {
    if (!token) return;
    fetch(
      "https://din-kreative-hjelper.cmsbackendsolutions.com/wp-json/myapp/v1/user-posts/",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((posts) => {
        console.log(posts);
        const postsContainer = document.getElementById("userPostsContainer");
        postsContainer.innerHTML = "";

        if (posts.length === 0) {
          showMessage("myPosts", "Ingen innlegg funnet.", false);
          return; // Exit the function early since there are no posts to display
        }

        posts.forEach((post) => {
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

        // This message will only show if posts are successfully loaded and displayed
        showMessage("myPosts", "Innlegg lastet!", true);
      })
      .catch((error) => {
        console.error("Error:", error);
        showMessage(
          "myPosts",
          "Kunne ikke laste innlegg: " + error.message,
          false
        );
      });
  }

  loadUserProfile();
  loadAndDisplayUserPosts();
});
