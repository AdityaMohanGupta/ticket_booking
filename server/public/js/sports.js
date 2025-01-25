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




function goBack() {
    window.history.back();
}



// Countdown Timer
let timeLeft = 300; // 5 minutes in seconds
const timerElement = document.getElementById('timer');

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    if (timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(timerInterval);
        timerElement.textContent = "00:00";
        goBack();
    }
}

const timerInterval = setInterval(updateTimer, 1000);


const proceedButtons = document.querySelectorAll('.card .btn');

    // Attach click event listeners to each button
    proceedButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            // Prevent default behavior if required
            e.preventDefault();

            // Get the card's title and price
            const card = button.closest('.card');
            const title = card.querySelector('.card-title').innerText;
            const price = card.querySelector('.price').innerText;

            // Update the "finall" section
            document.querySelector('.secondd').innerText = title;
            document.querySelector('.secondd2').innerText = price;

            // Optionally, display the "finall" section (if hidden by default)
            document.querySelector('.finall').style.display = 'block';
        });
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