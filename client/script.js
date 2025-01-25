//scrolltotop
const scrollToTopButton = document.getElementById('scrollToTop');

// Show the button when the user scrolls down 200px from the top
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        scrollToTopButton.classList.add('active');
    } else {
        scrollToTopButton.classList.remove('active');
    }
});




// Sticky Navbar
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 0);
});





// switch between words
var typed=new Typed(".auto-type",{
    strings:["MOVIES","CONCERTS","SPORTS"],
    typeSpeed:80,
    backSpeed:80,
    smartBackspace: true,
    looped:true
})


// select  buttons
const buttons_1 = document.querySelectorAll('#filter-1');
const eventsContainer_1 = document.querySelector('#ev_1');
buttons_1.forEach(button => {
    button.addEventListener('click', () => {
        buttons_1.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        eventsContainer_1.classList.add('fade-out');
        setTimeout(() => {
            eventsContainer_1.classList.remove('fade-out');
        }, 300); 
    });
});


const buttons_2 = document.querySelectorAll('#filter-2');
const eventsContainer_2 = document.querySelector('#ev_2');
buttons_2.forEach(button => {
    button.addEventListener('click', () => {
        buttons_2.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        eventsContainer_2.classList.add('fade-out');
        setTimeout(() => {
            eventsContainer_2.classList.remove('fade-out');
        }, 300);
    });
});


const buttons_3 = document.querySelectorAll('#filter-3');
const eventsContainer_3 = document.querySelector('#ev_3');
buttons_3.forEach(button => {
    button.addEventListener('click', () => {
        buttons_3.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        eventsContainer_3.classList.add('fade-out');
        setTimeout(() => {
            eventsContainer_3.classList.remove('fade-out');
        }, 300);
    });
});



function goToMovies() {
    window.location.href = "/movies"; 
}

function goToConcerts() {
    window.location.href = "/concerts"; 
}

function goToSports() {
    window.location.href = "/sports"; 
}





document.addEventListener('DOMContentLoaded', async () => {
    const authButton = document.getElementById('authButton');

    try {
        // const response = await fetch('/api/isLoggedIn');
        const response = await fetch('/api/isLoggedIn', {
            method: 'GET',
            credentials: 'include',  // Include cookies for JWT
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (data.isLoggedIn) {
            authButton.textContent = 'Log out';
            authButton.href = '/auth/logout';
        } else {
            authButton.textContent = 'Join Us';
            authButton.href = '/login';
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
});


// Get DOM elements
const headerBar = document.querySelector('.header-bar');
const navLinks = document.querySelector('.nav-links');
const overlay = document.querySelector('.overlay');
const ctaButton = document.querySelector('.cta .btn');

// Toggle menu function
function toggleMenu(e) {
    // Prevent event bubbling
    e.stopPropagation();
    
    headerBar.classList.toggle('active');
    navLinks.classList.toggle('active');
    overlay.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'initial';
}

// Add click event listener to hamburger menu
headerBar.addEventListener('click', toggleMenu);

// Close menu when clicking overlay
overlay.addEventListener('click', toggleMenu);

// Prevent CTA button from triggering menu
ctaButton.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Close menu when clicking a nav link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMenu({ stopPropagation: () => {} });
        }
    });
});

// Close menu when window is resized beyond mobile breakpoint
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        toggleMenu({ stopPropagation: () => {} });
    }
});