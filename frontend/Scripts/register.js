document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Inscription réussie ! Connectez-vous maintenant.');
            window.location.href = 'connexion.html';
        } else {
            alert(data.detail || "Erreur lors de l'inscription.");
        }
    } catch (error) {
        console.error('Erreur lors de l’inscription :', error);
        alert("Erreur de connexion au serveur.");
    }
});
