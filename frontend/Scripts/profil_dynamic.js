document.addEventListener('DOMContentLoaded', () => {
    // --- Section Switching (Main Navigation) ---
    const navLinks = document.querySelectorAll('.main-nav__link');
    const sections = document.querySelectorAll('.main-content .section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));
            sections.forEach(sec => sec.setAttribute('hidden', 'true')); // Hide inactive sections

            // Add active class to clicked link
            e.currentTarget.classList.add('active');

            // Show the corresponding section
            const targetSectionId = e.currentTarget.dataset.section;
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.removeAttribute('hidden'); // Show the active section

                // Scroll to the section if needed (optional, depends on layout)
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Close mobile menu if open
            const hamburger = document.querySelector('.hamburger-menu');
            const navList = document.querySelector('.main-nav__list');
            if (hamburger && hamburger.classList.contains('open')) {
                hamburger.classList.remove('open');
                navList.classList.remove('open');
            }
        });
    });

    // --- Profile Tab Switching (Seller/Buyer) ---
    const profileTabButtons = document.querySelectorAll('.profile-tabs .tab-btn');
    const profileTabContents = document.querySelectorAll('.profile-tab-content');

    profileTabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active state from all tab buttons and hide all contents
            profileTabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            profileTabContents.forEach(content => {
                content.classList.remove('active');
                content.setAttribute('hidden', 'true');
            });

            // Add active state to clicked button
            e.currentTarget.classList.add('active');
            e.currentTarget.setAttribute('aria-selected', 'true');

            // Show corresponding content
            const targetTabId = e.currentTarget.dataset.tab;
            const targetContent = document.getElementById(`${targetTabId}-panel`);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.removeAttribute('hidden');
            }
        });
    });

    // --- Profile Information Edit Functionality ---
    document.querySelectorAll('.profile-details .edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const formGroup = e.currentTarget.closest('.form-group');
            const inputField = formGroup.querySelector('input, textarea');

            if (inputField.readOnly) {
                // Enable editing
                inputField.readOnly = false;
                inputField.focus();
                e.currentTarget.innerHTML = '<i class="fas fa-check"></i>'; // Change icon to checkmark
                formGroup.classList.add('editing'); // Add editing class for styling
                // Optionally save original value for a "cancel" feature
                inputField.dataset.originalValue = inputField.value;

            } else {
                // Disable editing (simulate save)
                inputField.readOnly = true;
                e.currentTarget.innerHTML = '<i class="fas fa-edit"></i>'; // Change icon back to edit
                formGroup.classList.remove('editing'); // Remove editing class

                // Here you would typically send the updated data to your backend
                console.log(`Field ${inputField.id} updated to: ${inputField.value}`);
                // You might also add a notification: alert('Informations mises à jour !');
            }
        });

        // Add a blur event listener to "save" changes when clicking outside
        const inputField = button.closest('.form-group').querySelector('input, textarea');
        if (inputField) {
            inputField.addEventListener('blur', (e) => {
                const formGroup = e.target.closest('.form-group');
                const editButton = formGroup.querySelector('.edit-btn');
                if (!e.relatedTarget || !editButton.contains(e.relatedTarget)) { // Check if focus isn't moving to the edit button
                    if (!e.target.readOnly) { // If it's currently editable
                        e.target.readOnly = true;
                        editButton.innerHTML = '<i class="fas fa-edit"></i>';
                        formGroup.classList.remove('editing');
                        console.log(`Field ${e.target.id} updated to: ${e.target.value} (via blur)`);
                    }
                }
            });
        }
    });

    // --- Product Management (Publish, Trash, Delete) ---
    const productsGrid = document.getElementById('products-grid');
    const trashGrid = document.getElementById('trash-grid');
    const trashCountSpan = document.querySelector('.trash-count');
    const trashEmptyMessage = document.getElementById('trash-empty-message');

    // Initial check for trash content
    const updateTrashDisplay = () => {
        const trashItems = trashGrid.querySelectorAll('.product-card');
        trashCountSpan.textContent = `(${trashItems.length})`;
        if (trashItems.length === 0) {
            trashEmptyMessage.removeAttribute('hidden');
        } else {
            trashEmptyMessage.setAttribute('hidden', 'true');
        }
    };

    productsGrid.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        if (!productCard) return;

        const productId = productCard.dataset.productId;

        if (e.target.closest('.publish-product-btn')) {
            // Simulate publishing
            productCard.querySelector('.product-status').textContent = 'Publié';
            productCard.querySelector('.product-status').classList.remove('product-status--draft');
            productCard.querySelector('.product-status').classList.add('product-status--published');
            e.target.closest('.publish-product-btn').remove(); // Remove publish button
            alert(`Produit #${productId} publié !`);
        } else if (e.target.closest('.trash-product-btn')) {
            // Move to trash
            productCard.classList.add('trash-product-card'); // Add specific trash styling
            productCard.querySelector('.product-status').textContent = 'Corbeille';
            productCard.querySelector('.product-status').classList.remove('product-status--published', 'product-status--draft');
            productCard.querySelector('.product-status').classList.add('product-status--trashed'); // New class for trash status

            // Remove all actions and add restore/delete permanently
            const actionsDiv = productCard.querySelector('.product-actions');
            actionsDiv.innerHTML = `
                <button class="btn btn-primary product-action-btn restore-product-btn" aria-label="Restaurer le produit" data-product-id="${productId}">
                    <i class="fas fa-redo"></i> Restaurer
                </button>
                <button class="btn btn-danger product-action-btn delete-product-btn" aria-label="Supprimer définitivement le produit" data-product-id="${productId}">
                    <i class="fas fa-times"></i> Supprimer Définitif
                </button>
            `;
            trashGrid.appendChild(productCard);
            updateTrashDisplay();
            alert(`Produit #${productId} déplacé vers la corbeille.`);
        } else if (e.target.closest('.delete-product-btn')) {
            // Simulate permanent deletion
            if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement le produit #${productId} ?`)) {
                productCard.remove();
                updateTrashDisplay();
                alert(`Produit #${productId} supprimé définitivement.`);
            }
        }
    });

    // Event listener for actions within the trash grid
    trashGrid.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        if (!productCard) return;

        const productId = productCard.dataset.productId;

        if (e.target.closest('.restore-product-btn')) {
            // Restore from trash
            productCard.classList.remove('trash-product-card');
            productCard.querySelector('.product-status').textContent = 'Publié'; // Assuming it goes back to published
            productCard.querySelector('.product-status').classList.remove('product-status--trashed');
            productCard.querySelector('.product-status').classList.add('product-status--published');

            // Restore original actions (example, you might need to tailor this based on product status)
            const actionsDiv = productCard.querySelector('.product-actions');
            actionsDiv.innerHTML = `
                <button class="btn btn-secondary product-action-btn edit-product-btn" aria-label="Modifier le produit">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn btn-warning product-action-btn trash-product-btn" aria-label="Déplacer le produit vers la corbeille" data-product-id="${productId}">
                    <i class="fas fa-trash"></i> Corbeille
                </button>
                <button class="btn btn-danger product-action-btn delete-product-btn" aria-label="Supprimer définitivement le produit" data-product-id="${productId}">
                    <i class="fas fa-times"></i> Supprimer
                </button>
            `;
            productsGrid.appendChild(productCard);
            updateTrashDisplay();
            alert(`Produit #${productId} restauré !`);
        } else if (e.target.closest('.delete-product-btn')) {
             if (confirm(`Êtes-vous sûr de vouloir supprimer DÉFINITIVEMENT le produit #${productId} ? Cette action est irréversible.`)) {
                productCard.remove();
                updateTrashDisplay();
                alert(`Produit #${productId} supprimé définitivement.`);
            }
        }
    });

    updateTrashDisplay(); // Call on load to set initial count and message

    // --- Order Filtering ---
    const orderFilterButtons = document.querySelectorAll('.order-filters .filter-btn');
    const ordersList = document.getElementById('orders-list');
    const allOrders = ordersList.querySelectorAll('.order-card');

    orderFilterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active from all filter buttons
            orderFilterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });

            // Add active to clicked button
            e.currentTarget.classList.add('active');
            e.currentTarget.setAttribute('aria-pressed', 'true');

            const filter = e.currentTarget.dataset.filter;

            allOrders.forEach(order => {
                const orderStatus = order.dataset.status;
                if (filter === 'all' || orderStatus === filter) {
                    order.removeAttribute('hidden');
                    order.style.display = 'flex'; // Ensure flex display if hidden by CSS
                } else {
                    order.setAttribute('hidden', 'true');
                    order.style.display = 'none';
                }
            });
        });
    });

    // --- Favorite Toggle ---
    const favoritesGrid = document.getElementById('favorites-grid');
    const favoritesCountSpan = document.getElementById('favorites-count-number');

    favoritesGrid.addEventListener('click', (e) => {
        const favoriteBtn = e.target.closest('.favorite-btn');
        if (!favoriteBtn) return;

        const favoriteCard = favoriteBtn.closest('.favorite-card');
        if (!favoriteCard) return;

        // Toggle active class and update count
        if (favoriteBtn.classList.contains('active')) {
            favoriteBtn.classList.remove('active');
            favoriteBtn.setAttribute('aria-label', 'Ajouter ce produit aux favoris');
            favoriteCard.remove(); // Remove from display
        } else {
            favoriteBtn.classList.add('active');
            favoriteBtn.setAttribute('aria-label', 'Retirer ce produit des favoris');
            // In a real app, you'd add the product here
        }
        updateFavoritesCount();
    });

    const updateFavoritesCount = () => {
        const currentFavorites = favoritesGrid.querySelectorAll('.favorite-card').length;
        favoritesCountSpan.textContent = currentFavorites;
        favoritesCountSpan.parentNode.textContent = `${currentFavorites} produit${currentFavorites > 1 ? 's' : ''} favori${currentFavorites > 1 ? 's' : ''}`;
    };

    updateFavoritesCount(); // Initial count on load

    // --- Hamburger Menu Toggle (for mobile) ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('.main-nav__list');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navList.classList.toggle('open');
        });
    }

});