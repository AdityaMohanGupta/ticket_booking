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


// Get modal elements
const modal = document.getElementById("seat-selection-modal");
const closeBtn = document.querySelector(".close");

// Show modal when any showtime button is clicked
document.querySelectorAll(".showtimes div").forEach((button) => {
  button.addEventListener("click", () => {
    modal.style.display = "flex";
  });
});

// Hide modal when close button is clicked
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Hide modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
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