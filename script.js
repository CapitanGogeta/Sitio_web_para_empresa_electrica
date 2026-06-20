// script.js - Lógica para el sitio web estático modularizada

document.addEventListener('DOMContentLoaded', () => {
    console.log("El sitio web está listo.");
    
    // Inicializar componentes globales
    initMobileMenu();
    initScrollAnimations();
    
    // Inicializar panel de servicios SOLO si los elementos existen en la página actual
    if (document.querySelector('.service-tab')) {
        initServicesPanel();
    }
});

function initServicesPanel() {
    const tabs = document.querySelectorAll('.service-tab');
    const panes = document.querySelectorAll('.service-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover clase active de todas las pestañas y paneles
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Añadir clase active a la pestaña actual
            tab.classList.add('active');

            // Mostrar el panel correspondiente
            const targetId = tab.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }

            // Cambiar la imagen de la categoría
            const activeImages = document.querySelectorAll('.category-image.active');
            activeImages.forEach(img => img.classList.remove('active'));

            const targetImg = document.getElementById('img-' + targetId);
            if (targetImg) {
                targetImg.classList.add('active');
            }
        });
    });
}

function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Cambiar icono entre ☰ y ✕
            if (navMenu.classList.contains('active')) {
                menuToggle.innerHTML = '✕';
            } else {
                menuToggle.innerHTML = '☰';
            }
        });
    }
}

function initScrollAnimations() {
    const faders = document.querySelectorAll('.fade-in-up, .fade-in-row');
    
    if (faders.length > 0 && 'IntersectionObserver' in window) {
        // Añadimos una clase al body para indicar que JS está activo y soporta IntersectionObserver
        document.body.classList.add('js-enabled');
        
        const appearOptions = {
            threshold: 0.1, // Carga cuando al menos el 10% del elemento es visible
            rootMargin: "0px 0px -50px 0px" // Dispara un poco antes de que entre totalmente en pantalla
        };

        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach((entry, index) => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    // Si es una fila de la tabla, añadir un retraso en cascada
                    if(entry.target.classList.contains('fade-in-row')) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 100); 
                    } else {
                        entry.target.classList.add('visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });
    } else {
        console.log("Animaciones de scroll deshabilitadas o no soportadas.");
    }
}
