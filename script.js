// Update current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Typing effect for roles
const roles = ["Electrical Engineer", "SCADA & Automation", "PLC Programming", "OT Engineer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.querySelector('.typing-text');
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000; // Delay between current and next text

function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = newTextDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Start typing effect on load
document.addEventListener("DOMContentLoaded", function () {
    if (roles.length) setTimeout(type, newTextDelay + 250);
});

// Scroll Effects (Navbar style change and Fade-in elements)
window.addEventListener('scroll', () => {
    // Navbar
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Fade-in animations
    fadeElements();
});

const fadeElements = () => {
    const elements = document.querySelectorAll('.fade-in');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100; // Trigger point

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('visible');
        }
    });
};

// Initial check for elements in viewport
fadeElements();

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
    });
});



const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        btn.innerHTML = 'Transmitting... <i class="fas fa-spinner fa-spin" style="margin-left: 8px;"></i>';
        btn.style.opacity = '0.7';

        fetch('https://formsubmit.co/ajax/govindkumarplc1@gmail.com', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                _subject: 'New Portfolio Message from ' + name + '!'
            })
        })
        .then(response => response.json())
        .then(data => {
            btn.innerHTML = 'Message Sent Successfully! <i class="fas fa-check-circle" style="margin-left: 8px;"></i>';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            btn.style.opacity = '1';
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 5000);
        })
        .catch(error => {
            console.error('Error sending message', error);
            btn.innerHTML = 'Network Error. <i class="fas fa-exclamation-triangle" style="margin-left: 8px;"></i>';
            btn.style.background = '#ef4444';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.opacity = '1';
            }, 5000);
        });
    });
}
