// Copyright
const currentYear = new Date().getFullYear();
document.getElementById('copyrightYear').textContent = currentYear;

//section2 categories submenu 

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.categories > li > div > button').forEach(function(button) {
        button.addEventListener('click', function() {
            var submenu = this.parentElement.nextElementSibling;
            
            if (submenu) { 
                document.querySelectorAll('.submenu').forEach(function(sub) {
                    if (sub !== submenu) {
                        sub.classList.remove('reveal');
                    }
                });
                submenu.classList.toggle('reveal');
            } else {
                console.error("Submenu not found!"); 
            }
        });
    });
});
