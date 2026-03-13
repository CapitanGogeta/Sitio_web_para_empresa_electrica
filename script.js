// script.js - Lógica para el sitio web estático

document.addEventListener('DOMContentLoaded', () => {
    // Escuchar el click en los enlaces del menú para hacer scroll suave (aunque CSS ya tiene scroll-behavior)
    // También puede servir para cerrar menús móviles en el futuro.
    console.log("El sitio web está listo.");
    // Lógica para el panel de servicios
    const tabs = document.querySelectorAll('.service-tab');
    const panes = document.querySelectorAll('.service-pane');

    if (tabs.length > 0) {
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

    // Lógica del menú hamburguesa en mobile
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

    // --- Lógica de animaciones al hacer scroll (Intersection Observer) ---
    const faders = document.querySelectorAll('.fade-in-up, .fade-in-row');
    
    if (faders.length > 0 && 'IntersectionObserver' in window) {
        // Añadimos una clase al body para indicar que JS está activo y soporta
        // IntersectionObserver. El CSS ahora dependerá de esto para ocultar 
        // los elementos antes de animarlos.
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
                        }, index * 100); // 100ms de retraso por cada fila para que aparezcan una tras otra
                    } else {
                        entry.target.classList.add('visible');
                    }
                    // Dejar de observar una vez que ya apareció
                    observer.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });
    } else {
        // Fallback garantizado por el CSS: sin la clase js-enabled en el body, 
        // los elementos ya son completamente visibles ('opacity: 1' y previene que el contenido desaparezca).
        console.log("Animaciones de scroll deshabilitadas o no soportadas.");
    }
});
