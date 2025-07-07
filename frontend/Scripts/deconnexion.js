document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logoutLink');

    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevents the default link behavior (e.g., navigating to '#')

            // --- Your Logout Logic Goes Here ---
            console.log('User clicked "Se Déconnecter".');

            // Example:
            // You might send an AJAX request to your server to invalidate the session:
            // fetch('/api/logout', { method: 'POST' })
            //     .then(response => {
            //         if (response.ok) {
            //             window.location.href = '/login'; // Redirect to login page after successful logout
            //         } else {
            //             console.error('Logout failed.');
            //         }
            //     })
            //     .catch(error => {
            //         console.error('Error during logout:', error);
            //     });

            // Or, if it's a client-side only logout (e.g., clearing local storage):
            // localStorage.removeItem('userToken');
            // alert('Vous avez été déconnecté.');
            // window.location.href = '/'; // Redirect to home or login page
            // ------------------------------------

            alert('Déconnexion simulée. Replacez ceci avec votre logique de déconnexion réelle.');
        });
    }
});