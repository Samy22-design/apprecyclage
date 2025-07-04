document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const cancelButton = document.getElementById('cancelButton');

    // Écouteur d'événement pour la soumission du formulaire
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche le rechargement de la page par défaut

        // Récupération des valeurs des champs
        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const email = document.getElementById('email').value;
        const telephone = document.getElementById('telephone').value;
        const bio = document.getElementById('bio').value;
        const currentPassword = document.getElementById('current_password').value;
        const newPassword = document.getElementById('new_password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        const notificationsEmail = document.getElementById('notifications_email').checked;
        const notificationsSms = document.getElementById('notifications_sms').checked;

        let isValid = true;
        let errorMessage = '';

        // --- Validation des champs ---

        // Validation simple des champs non vides
        if (nom.trim() === '') {
            isValid = false;
            errorMessage += 'Le champ Nom est obligatoire.\n';
        }
        if (prenom.trim() === '') {
            isValid = false;
            errorMessage += 'Le champ Prénom est obligatoire.\n';
        }
        if (email.trim() === '') {
            isValid = false;
            errorMessage += 'Le champ Adresse e-mail est obligatoire.\n';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            isValid = false;
            errorMessage += 'L\'adresse e-mail n\'est pas valide.\n';
        }
        // Le numéro de téléphone est facultatif, mais si rempli, on pourrait ajouter une validation de format
        // if (telephone.trim() !== '' && !/^\+?[0-9\s-]{7,20}$/.test(telephone)) {
        //     isValid = false;
        //     errorMessage += 'Le numéro de téléphone n\'est pas valide.\n';
        // }


        // Validation du mot de passe si l'utilisateur souhaite le modifier
        if (newPassword !== '' || currentPassword !== '') {
            if (currentPassword.trim() === '') {
                isValid = false;
                errorMessage += 'Veuillez entrer votre mot de passe actuel pour changer de mot de passe.\n';
            }
            if (newPassword.trim() === '') {
                isValid = false;
                errorMessage += 'Veuillez entrer un nouveau mot de passe.\n';
            } else if (newPassword.length < 8) {
                isValid = false;
                errorMessage += 'Le nouveau mot de passe doit contenir au moins 8 caractères.\n';
            }
            if (newPassword !== confirmPassword) {
                isValid = false;
                errorMessage += 'Le nouveau mot de passe et la confirmation du mot de passe ne correspondent pas.\n';
            }
        }

        if (!isValid) {
            alert('Erreur de validation :\n' + errorMessage);
            return; // Arrête la fonction si la validation échoue
        }

        // Si toutes les validations passent, on peut "simuler" l'envoi des données
        const updatedProfile = {
            nom: nom,
            prenom: prenom,
            email: email,
            telephone: telephone,
            bio: bio,
            notificationsEmail: notificationsEmail,
            notificationsSms: notificationsSms
        };

        if (newPassword !== '') { // Seulement si le mot de passe a été modifié
            updatedProfile.newPassword = newPassword;
            // Dans un cas réel, vous enverriez aussi currentPassword au serveur pour vérification
        }

        console.log('Profil mis à jour :', updatedProfile);

        // Dans une application réelle, vous enverriez ces données à un serveur via une requête AJAX (fetch API ou XMLHttpRequest)
        // Exemple simplifié (à adapter pour une vraie API) :
        /*
        fetch('/api/profile', {
            method: 'POST', // ou 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer VOTRE_TOKEN_JWT' // Si authentification nécessaire
            },
            body: JSON.stringify(updatedProfile)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau ou du serveur');
            }
            return response.json();
        })
        .then(data => {
            alert('Profil mis à jour avec succès !');
            // Gérer la réponse du serveur (ex: actualiser l'interface utilisateur, rediriger)
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour du profil :', error);
            alert('Une erreur est survenue lors de l\'enregistrement du profil. Veuillez réessayer.');
        });
        */

        alert('Profil mis à jour avec succès (simulation) !');
        // Optionnel: Réinitialiser les champs de mot de passe après une mise à jour réussie
        document.getElementById('current_password').value = '';
        document.getElementById('new_password').value = '';
        document.getElementById('confirm_password').value = '';
    });

    // Écouteur d'événement pour le bouton Annuler
    cancelButton.addEventListener('click', () => {
        // Demander confirmation à l'utilisateur
        if (confirm('Êtes-vous sûr de vouloir annuler les modifications ? Les changements non enregistrés seront perdus.')) {
            // Dans un cas réel, vous pourriez rediriger l'utilisateur ou recharger les données originales
            window.location.reload(); // Recharger la page pour annuler les modifications
            // Ou naviguer vers une autre page : window.location.href = 'page_precedente.html';
        }
    });
});