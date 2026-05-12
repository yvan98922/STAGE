// Velocity Motors - Main JavaScript File

// User Authentication State
currentUser = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    initFAQ();
    initForms();
});

// Check if user is logged in
function checkAuthStatus() {
    const userData = localStorage.getItem('velocityUser');
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userNameSpan = document.getElementById('userName');

    if (userData && authButtons && userMenu) {
        currentUser = JSON.parse(userData);
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        if (userNameSpan) {
            userNameSpan.textContent = 'Hello, ' + currentUser.firstName;
        }
    }
}

// Login Form Handler
function initForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const contactForm = document.getElementById('contactForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked;

    // Get stored users
    const users = JSON.parse(localStorage.getItem('velocityUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('velocityUser', JSON.stringify(user));
        
        showMessage('Welcome back, ' + user.firstName + '!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showMessage('Invalid email or password. Please try again.', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match.', 'error');
        return;
    }

    if (password.length < 8) {
        showMessage('Password must be at least 8 characters long.', 'error');
        return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('velocityUsers') || '[]');
    if (users.find(u => u.email === email)) {
        showMessage('An account with this email already exists.', 'error');
        return;
    }

    // Create new user
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: password,
        joined: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('velocityUsers', JSON.stringify(users));

    showMessage('Account created successfully! Please sign in.', 'success');

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function handleContact(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Save to messages database
    const messages = JSON.parse(localStorage.getItem('velocityMessages') || '[]');
    const newMessage = {
        id: Date.now(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        interest: data.interest,
        message: data.message,
        newsletter: data.newsletter === 'on',
        date: new Date().toLocaleString(),
        read: false
    };
    messages.unshift(newMessage);
    localStorage.setItem('velocityMessages', JSON.stringify(messages));

    showMessage('Thanks for reaching out! We will get back to you within 24 hours.', 'success');
    e.target.reset();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('velocityUser');
    showMessage('You have been logged out.', 'info');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Message/Notification System
function showMessage(text, type) {
    // Remove existing messages
    const existing = document.querySelector('.message-toast');
    if (existing) existing.remove();

    // Create message element
    const message = document.createElement('div');
    message.className = 'message-toast ' + type;
    message.innerHTML = '<span>' + text + '</span>';

    // Styles
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 350px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;

    // Type-based colors
    if (type === 'success') {
        message.style.background = '#28a745';
    } else if (type === 'error') {
        message.style.background = '#dc3545';
    } else {
        message.style.background = '#17a2b8';
    }

    document.body.appendChild(message);

    // Auto remove
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 4000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Package selection handler
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-package')) {
        const card = e.target.closest('.package-card');
        const packageName = card.querySelector('h3').textContent;
        showMessage('You selected the ' + packageName + '. Redirecting to booking...', 'success');
    }
});

// Service button handlers
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-service')) {
        e.preventDefault();
        const serviceName = e.target.closest('.service-block').querySelector('h2').textContent;
        showMessage('Taking you to ' + serviceName + ' inquiry form...', 'info');
        setTimeout(() => {
            window.location.href = 'contact.html';
        }, 1000);
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add demo account for testing
(function initDemoAccount() {
    const users = JSON.parse(localStorage.getItem('velocityUsers') || '[]');
    if (users.length === 0) {
        users.push({
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@velocity.com',
            phone: '(555) 000-0000',
            password: 'password123',
            joined: new Date().toISOString()
        });
        localStorage.setItem('velocityUsers', JSON.stringify(users));
    }
})();
