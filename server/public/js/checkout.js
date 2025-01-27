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



let skipBeforeUnload = false;
const checkoutButton = document.getElementById('checkout-button');

checkoutButton.addEventListener('click', () => {

    skipBeforeUnload = true;
    // Make a request to the backend to create a Stripe checkout session
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((sessionId) => {
        // Redirect to the Stripe Checkout page using the session ID
        return Stripe(stripePublicKey).redirectToCheckout({ sessionId: sessionId.id });
    })
    .then((result) => {
        if (result.error) {
            alert(result.error.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});




let seatName = null; 

// Fetch the booked seat name
fetch('/movies/seat/booked', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        seatName = data.seatName; // Assign fetched seat name
        console.log("Fetched Seat Name:", seatName);
    } else {
        console.error("Failed to fetch seat name:", data.message);
    }
})
.catch(error => {
    console.error("Error fetching seat name:", error);
});
console.log("--",seatName);


// Handle page unload
window.addEventListener('beforeunload', () => {
    if (skipBeforeUnload) {
        console.log("Skipping beforeunload handler due to Stripe checkout.");
        return; // Do not execute the unload logic
    }
    fetch('/movies/seat/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            seatName: seatName
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Record deletion initiated:", data);
    })
    .catch(error => {
        console.error("Error deleting record:", error);
    });
});