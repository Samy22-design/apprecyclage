document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.page-menu');
    const allSections = document.querySelectorAll('.app-section');
    const initialSectionId = 'section-accueil'; // Set the default active section

    // Function to show a specific section
    function showSection(targetSectionId, direction = 'forward') {
        const currentActiveSection = document.querySelector('.app-section.active');
        const targetSection = document.getElementById(targetSectionId);

        if (currentActiveSection && currentActiveSection.id === targetSectionId) {
            // If already on the target section, do nothing
            return;
        }

        // Deactivate all sections first
        allSections.forEach(section => {
            section.classList.remove('active', 'slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left');
            // Hide section immediately if not target or current active
            if (section !== targetSection && section !== currentActiveSection) {
                section.style.display = 'none';
            }
        });

        // Set display to block for involved sections before transition
        if (currentActiveSection) {
            currentActiveSection.style.display = 'block';
        }
        targetSection.style.display = 'block';


        if (currentActiveSection) {
            // Apply slide-out class based on direction
            currentActiveSection.classList.add(direction === 'forward' ? 'slide-out-left' : 'slide-out-right');

            // Wait for the slide-out transition to complete before activating the new section
            currentActiveSection.addEventListener('transitionend', function handler() {
                currentActiveSection.classList.remove('active', 'slide-out-left', 'slide-out-right');
                currentActiveSection.style.display = 'none'; // Hide after transition
                currentActiveSection.removeEventListener('transitionend', handler);

                // Now activate and slide in the target section
                targetSection.classList.add('active', direction === 'forward' ? 'slide-in-right' : 'slide-in-left');
                // Ensure target section is visible and positioned correctly for its animation
                targetSection.style.transform = direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)';
                requestAnimationFrame(() => { // Use requestAnimationFrame for smoother start of animation
                    targetSection.style.transform = 'translateX(0)';
                });

            }, { once: true }); // Ensure handler runs only once
        } else {
            // If no current active section (first load), just slide in the target
            targetSection.classList.add('active', 'slide-in-right');
            targetSection.style.transform = 'translateX(0)';
        }

        // Update active navigation link
        navLinks.forEach(link => link.classList.remove('active'));
        const activeNavLink = document.querySelector(`.page-menu[data-target="${targetSectionId}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
    }


    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.dataset.target;
            const currentActiveSection = document.querySelector('.app-section.active');
            let direction = 'forward'; // Default direction

            if (currentActiveSection) {
                const currentId = currentActiveSection.id;
                // Determine direction based on tab order or a logical flow
                const navOrder = Array.from(navLinks).map(l => l.dataset.target);
                const currentIndex = navOrder.indexOf(currentId);
                const targetIndex = navOrder.indexOf(targetId);

                if (targetIndex < currentIndex) {
                    direction = 'backward';
                }
            }
            showSection(targetId, direction);
        });
    });

    // Handle internal button clicks that target sections (e.g., "Commencer" button)
    document.querySelectorAll('.btn-buttom[data-target]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.dataset.target;
            showSection(targetId, 'forward'); // Assume forward for internal navigation
        });
    });

    document.querySelectorAll('.link-text[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.dataset.target;
            showSection(targetId, 'forward');
        });
    });


    // Initial load: show the default section
    showSection(initialSectionId, 'none'); // 'none' for no initial transition
});