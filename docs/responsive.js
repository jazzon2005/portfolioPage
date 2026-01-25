/* ==========================================================================
   LÓGICA RESPONSIVE (Manejo de cambios por tamaño de pantalla)
   ========================================================================== */

const ResponsiveManager = {
    init: function() {
        this.handleResponsiveLogo();
        this.setupMobileFilters(); // Inicializamos los filtros móviles
        this.reorderProjectHeader(); // Inicializamos reordenamiento de header proyecto
        
        window.addEventListener('resize', () => {
            this.handleResponsiveLogo();
            this.reorderProjectHeader();
        });
    },

    // 1. Manejo del cambio de nombre en el logo
    handleResponsiveLogo: function() {
        const logoDiv = document.querySelector('.logo');
        if (!logoDiv) return;

        if (!logoDiv.dataset.originalContent) {
            logoDiv.dataset.originalContent = logoDiv.innerHTML;
        }

        const width = window.innerWidth;
        const isSmallScreen = width <= 768;
        
        const imgTag = `<img src="images/tem.png" alt="Marca personal" class="logo-mark">`;

        if (isSmallScreen) {
            logoDiv.innerHTML = `Juan Acosta ${imgTag}`;
        } else {
            logoDiv.innerHTML = logoDiv.dataset.originalContent;
        }
    },

    // 2. Lógica del Sidebar de Filtros (Móvil/Tablet)
    setupMobileFilters: function() {
        const sidebar = document.getElementById('filters-sidebar');
        
        // CLÁUSULA DE GUARDIA:
        // Si no hay sidebar (estamos en Home o Project), salimos silenciosamente.
        // Esto NO es un error, es el comportamiento esperado.
        if (!sidebar) return console.log("📂 error");; 

        const openBtn = document.getElementById('open-filters-btn');
        const closeBtn = document.getElementById('close-filters-btn');
        const applyBtn = document.getElementById('apply-filters-btn');
        // Reutilizamos el overlay del menú o usamos uno específico si existe
        const overlay = document.querySelector('.menu-overlay') || document.getElementById('filters-overlay');

        const toggleFilters = (show) => {
            if (show) {
                sidebar.classList.add('open');
                if (overlay) {
                    overlay.style.opacity = '1';
                    overlay.style.pointerEvents = 'auto';
                }
                document.body.style.overflow = 'hidden'; // Bloquear scroll
            } else {
                sidebar.classList.remove('open');
                if (overlay) {
                    // Solo ocultamos overlay si el menú principal también está cerrado
                    const header = document.querySelector('.main-header');
                    if (!header.classList.contains('open')) {
                        overlay.style.opacity = '0';
                        overlay.style.pointerEvents = 'none';
                    }
                }
                document.body.style.overflow = 'auto'; // Restaurar scroll
            }
        };

        if(openBtn) openBtn.addEventListener('click', () => toggleFilters(true));
        if(closeBtn) closeBtn.addEventListener('click', () => toggleFilters(false));
        if(applyBtn) applyBtn.addEventListener('click', () => toggleFilters(false));
        
        // Cerrar al hacer click fuera (en el overlay)
        if(overlay) {
            overlay.addEventListener('click', () => {
                if(sidebar.classList.contains('open')) toggleFilters(false);
            });
        }
    },

    // 3. Reordenar Header en Página de Proyecto (Móvil)
    reorderProjectHeader: function() {
        const header = document.querySelector('.main-header');
        if (!header) return;
        
        const nav = header.querySelector('nav');
        const actions = header.querySelector('.project-nav-actions');
        
        // Solo ejecutamos si existen ambos elementos (estamos en Project Page)
        if (!nav || !actions) return;

        const isMobile = window.innerWidth <= 768;
        // Verificamos si los botones ya están dentro del nav
        const isMoved = actions.parentElement === nav;

        if (isMobile && !isMoved) {
            // MODO MÓVIL: Mover botones DENTRO del menú desplegable (nav)
            nav.appendChild(actions);
            
            // Ajustes de estilo para que se vean bien dentro del menú vertical
            actions.style.flexDirection = 'column';
            actions.style.width = '100%';
            actions.style.marginTop = '2rem';
            actions.style.gap = '1rem';
            actions.style.alignItems = 'flex-start'; // Alinear con los links del menú
            
            // Asegurar que los enlaces se vean
            const links = actions.querySelectorAll('a');
            links.forEach(link => {
                link.style.display = 'inline-block';
                link.style.fontSize = '1.2rem'; // Tamaño acorde al menú móvil
            });

        } else if (!isMobile && isMoved) {
            // MODO ESCRITORIO: Devolver botones al header principal
            header.appendChild(actions);
            
            // Limpiar estilos inline para que retome el CSS original
            actions.style = '';
            const links = actions.querySelectorAll('a');
            links.forEach(link => link.style = '');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ResponsiveManager.init();
});