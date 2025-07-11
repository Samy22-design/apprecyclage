// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Fonctionnalité pour le menu mobile (depuis votre code existant)
    const iconBar = document.querySelector(".icon_bar");
    const mobileMenuPanel = document.querySelector('.widget_menu.content_panel_menu_mobile');
    const closeMobileMenu = document.querySelector(".contentclose");

    if (iconBar && mobileMenuPanel && closeMobileMenu) {
        iconBar.addEventListener('click', () => {
            mobileMenuPanel.classList.add('active'); // Ajoute une classe pour contrôler la visibilité via CSS
        });

        closeMobileMenu.addEventListener('click', () => {
            mobileMenuPanel.classList.remove('active');
        });
    }

    // Gérer le menu déroulant du profil (du header)
    const elementDrop = document.querySelector('.element-drop');
    const menuCpt = document.querySelector('.menu-cpt');

    if (elementDrop && menuCpt) {
        elementDrop.addEventListener('click', (event) => {
            event.stopPropagation(); // Empêche le clic de se propager au document
            menuCpt.classList.toggle('active'); // Bascule la classe 'active'
        });

        // Fermer le menu déroulant si on clique en dehors
        document.addEventListener('click', (event) => {
            if (!elementDrop.contains(event.target) && menuCpt.classList.contains('active')) {
                menuCpt.classList.remove('active');
            }
        });
    }

    // Fonction de déconnexion (exemple simplifié)
    window.logout = function() {
        console.log('Déconnexion de l\'utilisateur...');
        // Ici, vous feriez une requête AJAX pour déconnecter l'utilisateur
        // et/ou redirigeriez vers la page de connexion.
        alert('Vous avez été déconnecté (simulation).');
        // window.location.href = '/login.html'; // Exemple de redirection
    };

    // Initialisation du graphique Chart.js
    const userActivityChartCtx = document.getElementById('userActivityChart');
    if (userActivityChartCtx) {
        new Chart(userActivityChartCtx, {
            type: 'line', // Type de graphique : ligne
            data: {
                labels: ['Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4', 'Sem. 5', 'Sem. 6'],
                datasets: [{
                    label: 'Utilisateurs Actifs',
                    data: [120, 150, 130, 180, 160, 200],
                    backgroundColor: 'rgba(0, 123, 255, 0.2)', // Bleu avec transparence
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 2,
                    tension: 0.3, // Rend la ligne un peu courbe
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Permet de définir une hauteur fixe dans le CSS
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Nombre d\'utilisateurs'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Semaines'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw;
                            }
                        }
                    }
                }
            }
        });
    }

    // Gérer l'affichage des loaders (si vous n'utilisez pas jQuery pour cela)
    // Exemple d'une fonction gotoURL basique (à adapter à votre backend)
    window.gotoURL = function(url, loaderId) {
        if (loaderId) {
            document.getElementById(loaderId).style.display = 'block';
        }
        console.log(`Navigation vers : ${url}`);
        // Normalement, ici vous feriez une requête AJAX pour charger le contenu
        // ou une redirection directe
        window.location.href = url; // Redirection simple pour l'exemple
    };

    // Gestion de la modale PDF (si nécessaire)
    const previewPdfLinks = document.querySelectorAll('.previewPdfLink');
    const pdfModal = document.getElementById('pdfModal');
    const closeModalBtn = document.getElementById('closeModal');
    const pdfViewerDiv = document.getElementById('pdfViewer');
    const downloadLink = document.getElementById('downloadLink');

    if (pdfModal && closeModalBtn && pdfViewerDiv && previewPdfLinks.length > 0) {
        previewPdfLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const pdfUrl = link.getAttribute('href');
                downloadLink.setAttribute('href', pdfUrl);

                pdfModal.style.display = 'flex'; // Affiche la modale

                // Initialiser PDF.js Express Viewer
                // Note: 'WebViewer' est globalement disponible si le script 'webviewer.min.js' est bien chargé.
                // Le chemin de 'path' doit pointer vers le dossier 'lib' de PDF.js Express.
                if (typeof WebViewer !== 'undefined') {
                    WebViewer({
                        path: './lib', // Chemin vers les fichiers statiques de WebViewer
                        initialDoc: pdfUrl
                    }, pdfViewerDiv).then(instance => {
                        console.log('PDF Viewer loaded', instance);
                    }).catch(error => {
                        console.error('Error loading PDF Viewer:', error);
                    });
                } else {
                    pdfViewerDiv.innerHTML = '<p>PDF Viewer non disponible. Veuillez vérifier le chemin de `webviewer.min.js`.</p>';
                    console.error('WebViewer is not defined. Ensure webviewer.min.js is correctly loaded.');
                }
            });
        });

        closeModalBtn.addEventListener('click', () => {
            pdfModal.style.display = 'none'; // Cache la modale
            // Détruire l'instance du viewer si nécessaire pour éviter les fuites mémoire
            // if (WebViewer.getInstance()) WebViewer.getInstance().destroy();
        });
    }
});
// Gestion des modals
function openModal(type) {
    document.getElementById(`${type}Modal`).style.display = 'block';
}

function closeModal(type) {
    document.getElementById(`${type}Modal`).style.display = 'none';
    document.getElementById(`${type}Form`).reset();
}

// Gestion des formulaires
document.getElementById('collecteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const collecteData = {
        date: document.getElementById('collecteDate').value,
        type: document.getElementById('collecteType').value,
        quantite: document.getElementById('collecteQuantite').value
    };
    console.log('Nouvelle collecte:', collecteData);
    alert('Collecte enregistrée avec succès !');
    closeModal('collecte');
});

document.getElementById('venteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const venteData = {
        date: document.getElementById('venteDate').value,
        produit: document.getElementById('venteProduit').value,
        quantite: document.getElementById('venteQuantite').value,
        prix: document.getElementById('ventePrix').value
    };
    console.log('Nouvelle vente:', venteData);
    alert('Vente enregistrée avec succès !');
    closeModal('vente');
});

// Fermer le modal en cliquant à l'extérieur
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal('collecte');
        closeModal('vente');
    }
}