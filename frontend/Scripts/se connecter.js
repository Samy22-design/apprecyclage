document.addEventListener('DOMContentLoaded', () => {
    // --- Gestion de la navigation entre les sections (Accueil, Collecte, etc.) ---
    const navLinks = document.querySelectorAll('.app-nav .page-menu');
    const appSections = document.querySelectorAll('.app-section');
    const mainContent = document.getElementById('main-content');

    // Fonction pour afficher une section spécifique et mettre à jour la navigation
    const showSection = (targetSectionId) => {
        // Cacher toutes les sections
        appSections.forEach(section => {
            section.classList.remove('active');
        });

        // Afficher la section cible
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Remonter en haut de la section pour une meilleure UX
            mainContent.scrollTop = 0;
        }

        // Mettre à jour la classe 'active' sur les liens de navigation
        navLinks.forEach(link => {
            if (link.dataset.target === targetSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Attacher les écouteurs d'événements aux liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Empêche le comportement de lien par défaut
            const targetSectionId = event.currentTarget.dataset.target;
            showSection(targetSectionId);
        });
    });

    // --- Gestion des boutons de redirection internes (ex: "Commencer" vers "section-signup") ---
    const redirectButtons = document.querySelectorAll('[data-target]');
    redirectButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetSectionId = event.currentTarget.dataset.target;
            // Ne pas traiter si c'est un bouton de navigation standard déjà géré
            if (!event.currentTarget.classList.contains('page-menu')) {
                showSection(targetSectionId);
            }
        });
    });

    // --- Fonctions de gestion des formulaires de connexion et d'inscription ---

    // Fonction d'affichage des messages d'erreur de validation
    const displayError = (elementId, message) => {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Fonction pour masquer les messages d'erreur
    const hideError = (elementId) => {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    };

    // --- Formulaire de Connexion (Login) ---
    const loginForm = document.getElementById('loginForm'); // Assurez-vous que votre formulaire a cet ID
    if (loginForm) {
        loginForm.addEventListener('submit', async(event) => {
            event.preventDefault(); // Empêche le rechargement de la page

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            let isValid = true;

            // Validation de l'email
            if (!email) {
                displayError('email-error', 'L\'adresse email est requise.');
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                displayError('email-error', 'Veuillez entrer une adresse email valide.');
                isValid = false;
            } else {
                hideError('email-error');
            }

            // Validation du mot de passe
            if (!password) {
                displayError('password-error', 'Le mot de passe est requis.');
                isValid = false;
            } else {
                hideError('password-error');
            }

            if (isValid) {
                // --- LOGIQUE DE CONNEXION AU BACKEND (SIMULÉE) ---
                console.log('Tentative de connexion avec :', { email, password });

                // Ici, vous enverriez ces données à votre serveur backend
                // Exemple avec fetch (nécessite un serveur backend pour fonctionner) :
                try {
                    // Simulez un appel API
                    const response = await fetch('/api/login', { // Remplacez par l'URL de votre API de connexion
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        console.log('Connexion réussie !', data);
                        // Stocker le token de l'utilisateur (Exemple, utilisez localStorage pour la simplicité)
                        localStorage.setItem('userToken', data.token);
                        // Rediriger l'utilisateur vers la page principale de l'application
                        alert('Connexion réussie ! Redirection vers le tableau de bord.');
                        showSection('section-collecte'); // Ou la section de votre choix après connexion
                        // Ou window.location.href = 'dashboard.html'; si c'est une autre page HTML
                    } else {
                        // Gérer les erreurs de connexion (ex: mauvais identifiants)
                        displayError('password-error', data.message || 'Identifiants incorrects.');
                        console.error('Erreur de connexion :', data.message);
                    }
                } catch (error) {
                    console.error('Erreur réseau ou du serveur lors de la connexion :', error);
                    displayError('password-error', 'Une erreur est survenue. Veuillez réessayer plus tard.');
                }
            }
        });
    }

    // --- Formulaire d'Inscription (Signup) ---
    const signupForm = document.getElementById('signupForm'); // Assurez-vous que votre formulaire d'inscription a cet ID
    if (signupForm) {
        signupForm.addEventListener('submit', async(event) => {
            event.preventDefault();

            const signupEmailInput = document.getElementById('signup-email');
            const signupPasswordInput = document.getElementById('signup-password');

            const signupEmail = signupEmailInput.value.trim();
            const signupPassword = signupPasswordInput.value.trim();

            let isValid = true;

            // Validation de l'email
            if (!signupEmail) {
                displayError('signup-email-error', 'L\'adresse email est requise.');
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(signupEmail)) {
                displayError('signup-email-error', 'Veuillez entrer une adresse email valide.');
                isValid = false;
            } else {
                hideError('signup-email-error');
            }

            // Validation du mot de passe
            if (!signupPassword || signupPassword.length < 6) {
                displayError('signup-password-error', 'Le mot de passe doit contenir au moins 6 caractères.');
                isValid = false;
            } else {
                hideError('signup-password-error');
            }

            if (isValid) {
                // --- LOGIQUE D'INSCRIPTION AU BACKEND (SIMULÉE) ---
                console.log('Tentative d\'inscription avec :', { signupEmail, signupPassword });

                try {
                    const response = await fetch('/api/signup', { // Remplacez par l'URL de votre API d'inscription
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: signupEmail, password: signupPassword }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        console.log('Inscription réussie !', data);
                        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                        showSection('section-login'); // Rediriger vers la page de connexion
                    } else {
                        displayError('signup-email-error', data.message || 'Erreur lors de l\'inscription.');
                        console.error('Erreur d\'inscription :', data.message);
                    }
                } catch (error) {
                    console.error('Erreur réseau ou du serveur lors de l\'inscription :', error);
                    displayError('signup-email-error', 'Une erreur est survenue. Veuillez réessayer plus tard.');
                }
            }
        });
    }

    // --- Connexion avec Google ---
    const googleButton = document.querySelector('.google-button');
    if (googleButton) {
        googleButton.addEventListener('click', () => {
            console.log('Tentative de connexion avec Google...');
            // --- LOGIQUE D'AUTHENTIFICATION GOOGLE (CLIENT-SIDE) ---
            // Vous aurez besoin de la bibliothèque Google Sign-In ou de faire une redirection OAuth
            // Exemple simple de redirection (nécessite une configuration OAuth côté Google et votre backend) :
            // window.location.href = 'URL_DE_VOTRE_BACKEND_POUR_GOOGLE_AUTH';
            alert('Fonctionnalité Google non implémentée en frontend seul. Nécessite un backend OAuth.');
        });
    }

    // --- Connexion avec Facebook ---
    const facebookButton = document.querySelector('.facebook-button');
    if (facebookButton) {
        facebookButton.addEventListener('click', () => {
            console.log('Tentative de connexion avec Facebook...');
            // --- LOGIQUE D'AUTHENTIFICATION FACEBOOK (CLIENT-SIDE) ---
            // Vous aurez besoin du SDK Facebook JavaScript ou de faire une redirection OAuth
            // Exemple simple de redirection (nécessite une configuration OAuth côté Facebook et votre backend) :
            // window.location.href = 'URL_DE_VOTRE_BACKEND_POUR_FACEBOOK_AUTH';
            alert('Fonctionnalité Facebook non implémentée en frontend seul. Nécessite un backend OAuth.');
        });
    }

    // --- Vérification de l'état de connexion au chargement de la page ---
    // Si vous avez un token en localStorage, vous pourriez décider d'afficher une section spécifique
    // ou de vérifier la validité du token auprès du backend.
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
        console.log('Token utilisateur trouvé, potentiellement connecté.');
        // Ici, vous pourriez faire un appel API à votre backend pour vérifier la validité du token
        // et rediriger l'utilisateur vers une section connectée par défaut, par ex. 'section-profil'
        // showSection('section-profil');
    } else {
        // Afficher la section d'accueil ou de connexion par défaut
        showSection('section-accueil');
    }
});