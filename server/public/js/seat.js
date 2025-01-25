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


// seat number visible isse ho rha haii
document.addEventListener("DOMContentLoaded", () => {

    const seats = document.querySelectorAll(".seat img");
    const seats2 = document.querySelectorAll(".seat2 img");

    const seatTextElement = document.querySelector(".secondd");
    const amountTextElement = document.querySelector(".secondd2");


    function updateSeatAndAmount(seatName, price) {
        seatTextElement.textContent = seatName || "---";
        amountTextElement.textContent = `₹ ${price}`;
    }

    seats.forEach((seat) => {
        seat.addEventListener("click", () => {
            resetSeats(seats, seats2);
            if (seat.src.includes("seat.png")) {
                seat.src = "../assests/seat4.png";
                const label = seat.parentElement.querySelector('.seat-label');
                label.innerText = seat.getAttribute("data-name");
                const seatName = seat.getAttribute("data-name");
                label.style.display = "block";
                updateSeatAndAmount(seatName, 300);
            } else {
                seat.src = "../assests/seat.png";
                const label = seat.parentElement.querySelector('.seat-label');
                label.style.display = "none";
                updateSeatAndAmount(null, 0);
            }
        });
    });

    seats2.forEach((seat2) => {
        seat2.addEventListener("click", () => {
            resetSeats(seats, seats2);
            if (seat2.src.includes("seat02.png")) {
                seat2.src = "../assests/seat3.png";
                const label = seat2.parentElement.querySelector('.seat-label');
                label.innerText = seat2.getAttribute("data-name");
                const seatName = seat2.getAttribute("data-name");
                label.style.display = "block";
                updateSeatAndAmount(seatName, 1000);
            } else {
                seat2.src = "../assests/seat02.png";
                const label = seat2.parentElement.querySelector('.seat-label');
                label.style.display = "none";
                updateSeatAndAmount(null, 0);
            }
        });
    });

    function resetSeats(seats, seats2) {
        seats.forEach(seat => {
            if(!seat.src.includes("seat6.png")){
                seat.src = "../assests/seat.png";
                const label = seat.parentElement.querySelector('.seat-label');
                if (label) label.style.display = "none";
            }
        });
        seats2.forEach(seat2 => {
            if(!seat2.src.includes("seat5.png")){
                seat2.src = "../assests/seat02.png";
                const label = seat2.parentElement.querySelector('.seat-label');
                if (label) label.style.display = "none";
            }
        });
        updateSeatAndAmount(null, 0);
    }
});


async function fetchAndUpdateSeats() {
    try {
        // Fetch booked seats from the server
        const response = await fetch('/movies/seat/check');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const bookedSeats = await response.json(); // Parse JSON from the response
        // console.log('Booked Seats:', bookedSeats); // Log fetched data

        // Select and update seat images
        const updateSeatImages = (selector, imagePath) => {
            const seatElements = document.querySelectorAll(selector);
            // console.log(`Seat Elements for selector "${selector}":`, seatElements); // Log selected elements

            seatElements.forEach((seat) => {
                const seatName = seat.getAttribute("data-name");
                // console.log(`Inspecting seat: ${seatName}`); // Log current seat being inspected
                if (bookedSeats.some((seatData) => seatData.seatName === seatName)) {
                    // console.log(`Updating seat "${seatName}" with image: ${imagePath}`); // Log update action
                    seat.setAttribute("src", imagePath);
                    const label = seat.parentElement.querySelector('.seat-label');
                    label.innerText = seat.getAttribute("data-name");
                    label.style.display = "block";
                }
            });
        };

        // Update images for both sets of seats
        updateSeatImages(".seat .seat-img", "../assests/seat6.png");
        updateSeatImages(".seat2 .seat-img", "../assests/seat5.png");
    } catch (error) {
        console.error("Error fetching seat data:", error);
    }
}

// Fetch and update seats on page load
document.addEventListener("DOMContentLoaded", fetchAndUpdateSeats);





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






function proceedToCheckout(event) {
    event.preventDefault();

    const seat = document.getElementById('second').textContent.trim();
    console.log(seat);

    if (!seat || seat === '---') {
        alert('Please select a valid seat.');
        return;
    }

    const payload = { seatName: seat };
    console.log(payload);
    fetch('/movies/seat/booked', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                window.location.href = '/movies/seat/checkout';
            } else {
                alert('Failed to process the booking. Please try again.');
            }
        })
        .catch(error => console.error('Error:', error));
}
