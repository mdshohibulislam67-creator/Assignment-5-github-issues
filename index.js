document.getElementById('login-form')
.addEventListener('submit', function (e) {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    if (usernameInput === 'admin' && passwordInput === 'admin123') {
        alert('Login Successful!');
        window.location.href = 'main.html'; 
    } else {
        alert('Invalid credentials! Use admin / admin123');
    }
});
