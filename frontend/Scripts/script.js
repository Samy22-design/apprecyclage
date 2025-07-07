document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    emailError.style.display = 'none';
    passwordError.style.display = 'none';

    try {
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            window.location.href = 'index.html';  // rediriger vers accueil
        } else {
            if (data.detail === 'Email ou mot de passe incorrect') {
                emailError.style.display = 'block';
                passwordError.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        emailError.style.display = 'block';
        emailError.textContent = 'Erreur de connexion au serveur.';
    }
});
