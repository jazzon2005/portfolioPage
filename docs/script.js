/* ==========================================================================
   CONFIGURACIÓN GENERAL
   ========================================================================== */
// Inicializamos EmailJS inmediatamente para que esté listo en cualquier click
try {
    // Usamos la configuración centralizada
    if (typeof SITE_CONFIG !== 'undefined') {
        emailjs.init(SITE_CONFIG.emailjs.publicKey);
    } else {
        console.error("Falta el archivo config.js");
    }
} catch (e) {
    console.warn("EmailJS no pudo iniciarse (posible bloqueo de adblock):", e);
}

gsap.registerPlugin(ScrollTrigger);

// --- HELPER: Aplanar tags para visualización en tarjetas ---
// Convierte el objeto tags { type:[], focus:[] } en un array simple ["Concept", "Personaje"...]
const getFlatTags = (project) => {
    if (!project.tags) return [];
    
    let tagsList = [];
    if (Array.isArray(project.tags)) {
        tagsList = project.tags;
    } else {
        tagsList = Object.values(project.tags).flat().filter(tag => typeof tag === 'string');
    }

    // TRADUCCIÓN DE TAGS AL VUELO
    if (typeof LanguageManager !== 'undefined') {
        return tagsList.map(tag => LanguageManager.translateTag(tag));
    }
    return tagsList;
};

/* ==========================================================================
   BLOQUE 1: LÓGICA DE LANDING PAGE (Index)
   Exclusivo para la página de inicio: Animaciones de entrada, Grid de trabajos.
   ========================================================================== */
const LandingLogic = {
    init: function() {
        console.log("📍 Iniciando Lógica de Landing Page");
        this.runAnimations();
        this.renderFeaturedProjects();
        this.setupScrollSpy();
    },

    // --- TUS ANIMACIONES ORIGINALES (Hero, About, Footer) ---
    runAnimations: function() {
        const isMobile = window.innerWidth <= 480;

        // 1. Animación Sección About
        const aboutImg = document.querySelector('.about-image');
        const aboutTxt = document.querySelector('.about-text');

        if(aboutImg && aboutTxt) {
            if (isMobile) {
                gsap.fromTo(aboutImg, 
                    { opacity: 0, y: 80 },
                    { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".about-image", start: "top 80%", end: "top 50%", scrub: true } }
                );
                gsap.fromTo(aboutTxt, 
                    { opacity: 0, y: 80 },
                    { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".about-text", start: "top 85%", end: "top 50%", scrub: true } }
                );
            } else {
                gsap.fromTo(aboutTxt, 
                    { opacity: 0, y: 80 },
                    { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".about-text", start: "top 80%", end: "top 50%", scrub: true } }
                );
                gsap.fromTo(aboutImg, 
                    { opacity: 0, y: 80 },
                    { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".about-image", start: "top 85%", end: "top 50%", scrub: true } }
                );
            }
        }

        // 2. Animación Hero (Solo si existe)
        if(document.querySelector('.hero-text')) {
            gsap.from(".hero-text", { opacity: 0, y: 80, duration: 1.4, ease: "power3.out" });
            gsap.from(".hero-image img", { opacity: 0, y: 100, scale: 1.3, duration: 1.6, ease: "power3.out", delay: 0.2 });
            gsap.to(".hero-image img", {
                scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
                yPercent: -15, ease: "none",
            });
        }
        
        // 3. Animación Contact Sticky (Split Section)
        gsap.utils.toArray(".help-item").forEach((item) => {
            gsap.fromTo(item,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: item, start: "top 85%", end: "bottom 75%", toggleActions: "play none none reverse" } }
            );
        });
    },

    // --- RENDERIZADO DE PROYECTOS (Grid de la Home) ---
    renderFeaturedProjects: function() {
        const grid = document.getElementById('featured-grid');
        if (!grid) return; 

        if (typeof projectsData === 'undefined') {
            console.error("❌ Error: projectsData no cargado.");
            return;
        }

        const featured = projectsData.filter(p => p.featured);
        
        grid.innerHTML = featured.map(p => {
            const displayTags = getFlatTags(p).slice(0, 3);
            return `
            <article class="work-card" onclick="window.location.href='project.html?id=${p.id}'">
                <div class="work-image">
                    <img src="${p.coverImage}" alt="${p.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/141414/00e0e0?text=No+Image'">
                </div>
                <div class="work-info">
                    <span class="work-cat">${p.category}</span>
                    <h3 class="work-title">${p.title}</h3>
                    <div class="work-tags">
                        ${displayTags.map(tag => `<span class="w-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
            `;
        }).join('');

        // Usamos el CONTENEDOR como trigger para todo el grupo.
        // Esto garantiza que si el grid sale de pantalla, todo se resetea junto.
        gsap.from("#featured-grid .work-card", {
            scrollTrigger: { 
                trigger: "#featured-grid", 
                start: "top 90%", // Empieza cuando el top del grid entra al 90% de la pantalla
                toggleActions: "play none none reverse" // Se reproduce al entrar, se reversa al salir por arriba
            },
            y: 0, 
            opacity: 0, 
            duration: 0.8, 
            stagger: 0.1, // Efecto cascada
            ease: "power2.out"
        });
        
        // Forzamos actualización para que GSAP reconozca las nuevas tarjetas
        ScrollTrigger.refresh();
    },

    // --- SCROLL SPY (Menú activo al bajar) ---
    setupScrollSpy: function() {
        const sections = document.querySelectorAll("section[id]");
        const navLinks = document.querySelectorAll(".main-header nav ul li a");
        if(sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const id = entry.target.getAttribute("id");
                // Buscamos el link que corresponde a esta sección
                const navItem = document.querySelector(`.main-header a[href="#${id}"]`);
                
                if (entry.isIntersecting && navItem) {
                    navLinks.forEach((link) => link.classList.remove("active"));
                    navItem.classList.add("active");
                }
            });
        }, { root: null, threshold: 0.5 }); // 50% visible para activar

        sections.forEach((section) => observer.observe(section));
    }
};


/* ==========================================================================
   BLOQUE 2: LÓGICA DE PROYECTO (Page Detail)
   Exclusivo para project.html: Carga datos dinámicos, inyecta textos.
   ========================================================================== */
const ProjectLogic = {
    init: function() {
        console.log("🎨 Iniciando Página de Proyecto");
        this.loadProjectDetails();
    },

    loadProjectDetails: function() {
        // 1. Obtener ID de la URL
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');

        if (typeof projectsData === 'undefined') return;
        
        // 2. Buscar proyecto
        const project = projectsData.find(p => p.id === projectId);

        if (!project) {
            console.error("Proyecto no encontrado: " + projectId);
            document.body.innerHTML = "<h1 style='color:white; text-align:center; margin-top:100px'>Proyecto no encontrado 404</h1><p style='color:#ccc; text-align:center'><a href='index.html' style='color:#00e0e0'>Volver al inicio</a></p>";
            return;
        }

        // 3. Inyectar Textos e Imágenes
        document.title = `${project.title} | Juan Esteban`;
        this.setText('p-category', project.category);
        this.setText('p-title', project.title);
        this.setText('p-description', project.description);

        
        const heroBg = document.getElementById('p-hero-img');
        if(heroBg) heroBg.style.backgroundImage = `url('${project.heroImage || project.coverImage}')`;

        // Tags del Hero (usamos el helper flatten)
        // Generamos links que apuntan a gallery.html con el parámetro ?filter=NombreTag
        const heroTagsContainer = document.getElementById('p-hero-tags');
        if(heroTagsContainer) {
            const displayTags = getFlatTags(project); 
            heroTagsContainer.innerHTML = displayTags.map(tag => 
                `<a href="gallery.html?filter=${encodeURIComponent(tag)}" class="hero-tag">${tag}</a>`
            ).join('');
        }

        // 4. Meta Datos (Año / Rol)
        const metaContainer = document.getElementById('p-meta');
        if(metaContainer) {
            let metaHtml = '';
            if(project.year) metaHtml += `<span><i class="fa-regular fa-calendar"></i> ${project.year}</span>`;
            if(project.role) metaHtml += `<span><i class="fa-solid fa-user-pen"></i> ${project.role}</span>`;
            metaContainer.innerHTML = metaHtml;
        }

        // 5. Herramientas
        const toolsContainer = document.getElementById('p-tools');
        if(toolsContainer && project.tools) {
            toolsContainer.innerHTML = project.tools.map(t => `<span class="tech-tag">${t}</span>`).join('');
        }

        // 6. Enlaces Externos
        const linksContainer = document.getElementById('p-links');
        if(linksContainer && project.links) {
            let linksHtml = '';
            if(project.links.artstation) linksHtml += `<a href="${project.links.artstation}" target="_blank" class="btn primary small-btn"><i class="fa-brands fa-artstation" style="color:#00e0e0; transform:scale(1.8);"></i></a>`;
            if(project.links.instagram) linksHtml += `<a href="${project.links.instagram}" target="_blank" class="btn primary small-btn"><i class="fa-brands fa-instagram" style="color:#00e0e0;transform:scale(1.8);"></i></a>`;
            if(project.links.itch) linksHtml += `<a href="${project.links.itch}" target="_blank" class="btn primary small-btn" style="color:#00e0e0; transform:scale(1.8);"><i class="fa-brands fa-itch-io"></i></a>`;
            linksContainer.innerHTML = linksHtml;
        }

        // 7. Galería de Proceso (CUADRADA)
        const galleryContainer = document.getElementById('p-gallery');
        if(galleryContainer && project.gallery) {
            galleryContainer.innerHTML = project.gallery.map(item => {
                // Soportamos que 'item' sea un string (URL) o un objeto {src, caption}
                const src = typeof item === 'string' ? item : item.src;
                const caption = typeof item === 'string' ? 'Detalle del Proyecto' : (item.caption || 'Detalle');
                const desc = typeof item === 'string' ? 'Descripción' : (item.desc || 'Descripción');

                return `
                <div class="gallery-item">
                    <img 
                        src="${src}" 
                        class="zoomable-img" 
                        alt="${caption}" 
                        loading="lazy"
                        data-title="${caption}"
                        data-desc="${desc}"
                    >
                </div>`;
            }).join('');

            // Una vez renderizada la galería, configuramos la expansión "Netflix"
            this.setupGalleryExpansion();
        }

        // Cargar Proyectos Relacionados (Llamada al nuevo sistema)
        this.renderRelatedProjects(project);

        // 8. EJECUTAR ANIMACIONES (Al final, cuando ya hay DOM)
        this.runAnimations();
    },

    // Helper para asignar texto de forma segura
    setText: function(id, text) {
        const el = document.getElementById(id);
        if(el) el.textContent = text || "";
    },

    // --- LÓGICA DE RELACIONADOS MEJORADA ---
    renderRelatedProjects: function(currentProject) {
        const container = document.getElementById('related-projects-section');
        const grid = document.getElementById('related-projects-grid');
        
        if (!container || !grid) return;

        // 1. OBTENER Y APLANAR TAGS DEL PROYECTO ACTUAL
        const currentTagsRaw = getFlatTags(currentProject);
        const currentTags = currentTagsRaw.map(t => t.toLowerCase().trim());
        
        if (currentTags.length === 0) {
            container.style.display = 'none';
            return;
        }

        // 2. CALCULAR COINCIDENCIAS (SCORE)
        // Filtramos solo aquellos que tienen al menos 1 coincidencia (> 0)
        let allCandidates = projectsData
            .filter(p => p.id !== currentProject.id)
            .map(p => {
                const otherTagsRaw = getFlatTags(p);
                const otherTags = otherTagsRaw.map(t => t.toLowerCase().trim());
                const matches = otherTags.filter(tag => currentTags.includes(tag)).length;
                return { project: p, matches: matches };
            })
            .filter(item => item.matches > 0);

        // Si no hay ningún candidato con al menos 1 coincidencia, nos vamos
        if (allCandidates.length === 0) {
            container.style.display = 'none';
            return;
        }

        // 3. IDENTIFICAR AL "MEJOR CANDIDATO" (Para el futuro lightbox)
        // Ordenamos temporalmente para encontrar el maxScore
        allCandidates.sort((a, b) => b.matches - a.matches);
        
        const maxScore = allCandidates[0].matches;
        
        // Filtramos todos los que tienen el puntaje máximo para elegir uno al azar en caso de empate
        const bestMatches = allCandidates.filter(item => item.matches === maxScore);
        const winner = bestMatches[Math.floor(Math.random() * bestMatches.length)];
        
        this.bestRelatedProject = winner.project; 
        console.log(`🏆 Mejor coincidencia (${maxScore} pts):`, this.bestRelatedProject.title);

        // 4. ESTRATEGIA DE SELECCIÓN DE TARJETAS (SMART FILL)
        // Queremos llenar 3 espacios.
        // - Grupo A (High Quality): Coincidencias >= mitad del máximo.
        // - Grupo B (Low Quality): El resto (> 0).
        
        const threshold = Math.max(1, Math.floor(maxScore / 2));
        
        const highQuality = allCandidates.filter(item => item.matches >= threshold);
        const lowQuality = allCandidates.filter(item => item.matches < threshold);

        // Función de ordenamiento (Matches descendente + Aleatoriedad para variedad)
        const sortRandomly = (arr) => {
            return arr.sort((a, b) => {
                if (b.matches !== a.matches) return b.matches - a.matches;
                return 0.5 - Math.random();
            });
        };

        sortRandomly(highQuality);
        sortRandomly(lowQuality);

        // Llenamos la lista final priorizando High Quality
        let finalSelection = [...highQuality];
        
        // Si no llegamos a 3, rellenamos con Low Quality
        if (finalSelection.length < 3) {
            const needed = 3 - finalSelection.length;
            finalSelection = finalSelection.concat(lowQuality.slice(0, needed));
        }

        // Cortamos a 3 por si acaso nos pasamos
        finalSelection = finalSelection.slice(0, 3);

        // 5. RENDERIZAR
        container.style.display = 'block';
        grid.innerHTML = finalSelection.map(item => {
             const p = item.project;
             const displayTags = getFlatTags(p).slice(0, 3);
             return `
            <article class="work-card" onclick="window.location.href='project.html?id=${p.id}'">
                <div class="work-image">
                    <img src="${p.coverImage}" alt="${p.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/141414/00e0e0?text=No+Image'">
                </div>
                <div class="work-info">
                    <span class="work-cat">${p.category}</span>
                    <h3 class="work-title">${p.title}</h3>
                    <div class="work-tags">
                        ${displayTags.map(tag => `<span class="w-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
            `;
        }).join('');
        
         gsap.from("#related-projects-grid .work-card", {
            scrollTrigger: { 
                trigger: "#related-projects-grid", 
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out"
        });
    },

    // --- NUEVO: ANIMACIONES ESTILO LANDING ---
    runAnimations: function() {
        const tl = gsap.timeline();
        // El Hero se anima al cargar (sin scrollTrigger para evitar reseteos bruscos en el top)
        tl.from("#p-category", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" })
          .from("#p-title", { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.4")
          .from("#p-hero-tags", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
          .from("#p-meta", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");

        // Contenido: Se oculta al subir y reaparece al bajar
        gsap.from(".project-desc", {
            scrollTrigger: { 
                trigger: ".project-desc", 
                start: "top 85%",
                toggleActions: "play none none reverse" // Magia: reverso al subir
            },
            y: 50, opacity: 0, duration: 1, ease: "power2.out"
        });
        
        gsap.from(".project-tech", {
            scrollTrigger: { 
                trigger: ".project-tech", 
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50, opacity: 0, duration: 1, delay: 0.2, ease: "power2.out"
        });

        gsap.utils.toArray(".gallery-item:not(.hidden)").forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: { 
                    trigger: item, 
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                },
                y: 40, opacity: 0, duration: 0.8, delay: i * 0.05, ease: "power2.out"
            });
        });
    },

    // --- GALERÍA EXPANDIBLE (RESOLUCIÓN DINÁMICA) ---
    setupGalleryExpansion: function() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        // 1. Determinar límite según resolución
        const width = window.innerWidth;
        let limit = 10; // Default Desktop (Estandar)

        if (width <= 768 && width >= 481) {
            limit = 6; // Tablet
        } else if (width < 481) {
            limit = 4; // Móvil
        }

        if (galleryItems.length <= limit) return; 

        // 2. Ocultar los que exceden el límite
        galleryItems.forEach((item, index) => {
            if (index >= limit) {
                item.classList.add('hidden');
            }
        });

        const container = document.querySelector('.project-gallery-section .container');
        if(container.querySelector('.load-more-container')) return;

        const btnContainer = document.createElement('div');
        btnContainer.className = 'load-more-container';
        btnContainer.innerHTML = `<button class="load-more-btn" aria-label="Ver más"><i class="fa-solid fa-chevron-down"></i></button>`;
        
        container.appendChild(btnContainer);

        const btn = btnContainer.querySelector('button');
        const icon = btn.querySelector('i');
        let isExpanded = false;

        btn.addEventListener('click', () => {
            isExpanded = !isExpanded;

            if (isExpanded) {
                // EXPANDIR
                galleryItems.forEach((item, index) => {
                    if (index >= limit) {
                        item.classList.remove('hidden');
                        gsap.fromTo(item, 
                            { opacity: 0, y: 20 }, 
                            { opacity: 1, y: 0, duration: 0.5, delay: (index - limit) * 0.05, ease: "power2.out" }
                        );
                    }
                });
                icon.className = 'fa-solid fa-chevron-up';
                btn.setAttribute('aria-label', 'Ver menos');
                
            } else {
                // CONTRAER
                galleryItems.forEach((item, index) => {
                    if (index >= limit) {
                        item.classList.add('hidden');
                    }
                });
                icon.className = 'fa-solid fa-chevron-down';
                btn.setAttribute('aria-label', 'Ver más');

                const galleryTitle = document.querySelector('.gallery-title');
                if(galleryTitle) {
                    galleryTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
};

/* ==========================================================================
   BLOQUE 4: LÓGICA DE GALERÍA COMPLETA (Gallery Page)
   Para gallery.html: Muestra todo, filtros por categoría.
   ========================================================================== */
const GalleryLogic = {
    activeFilters: {
        type: [], focus: [], context: [], technique: [], status: []
    },
    currentPage: 1,
    itemsPerPage: 9,

    // Mapeo de nombres para mostrar en el Sidebar
    labels: {
        type: "Tipo de Trabajo", 
        focus: "Enfoque", 
        context: "Contexto", 
        technique: "Técnica", 
        status: "Estado del Proyecto"
    },

    init: function() {
        console.log("📂 Iniciando Galería Facetada Multivalor");
        this.generateSidebar();

        // Configurar items por página según resolución inicial
        this.updateItemsPerPage();

        // Escuchar cambios de tamaño de pantalla para ajustar itemsPerPage
        window.addEventListener('resize', () => {
            this.updateItemsPerPage();
            this.renderAllProjects(); // Re-renderizar para aplicar el nuevo límite
        });
        
        // --- ACTIVACIÓN DESDE URL ---
        const params = new URLSearchParams(window.location.search);
        const urlFilter = params.get('filter');
        if (urlFilter) {
            console.log("Filtro URL detectado:", urlFilter);
            this.selectFilterByName(decodeURIComponent(urlFilter));
        }

        this.renderAllProjects();
        this.updateUI();
    },

    // --- NUEVA FUNCIÓN: AJUSTAR ITEMS POR PÁGINA SEGÚN RESOLUCIÓN ---
    updateItemsPerPage: function() {
        const width = window.innerWidth;
        
        if (width > 1024) {
            this.itemsPerPage = 9; // Desktop: 3 columnas x 3 filas
        } else if (width > 480 && width <= 1024) {
            this.itemsPerPage = 8; // Tablet: 2 columnas x 4 filas (para que quede par y cuadrado)
        } else {
            this.itemsPerPage = 5; // Móvil: 1 columna x 6 filas (opcional, para no scrollear tanto)
        }
        
        // Opcional: Si al cambiar itemsPerPage la página actual queda vacía, volver a la 1
        // (aunque renderAllProjects ya tiene una validación similar)
    },

    // 1. GENERAR SIDEBAR DINÁMICO
    generateSidebar: function() {
        const wrapper = document.getElementById('filters-wrapper');
        if (!wrapper || typeof projectsData === 'undefined') return;

        const facets = { type: new Set(), focus: new Set(), context: new Set(), technique: new Set(), status: new Set() };

        projectsData.forEach(p => {
            if(p.tags) {
                // Iteramos por las 5 categorías
                Object.keys(facets).forEach(key => {
                    const values = p.tags[key];
                    if (Array.isArray(values)) {
                        values.forEach(v => facets[key].add(v)); // Si es array, agregamos cada uno
                    } else if (values) {
                        facets[key].add(values); // Si es string (legacy), agregamos
                    }
                });
            }
        });

        wrapper.innerHTML = '';
        const order = ['type', 'focus', 'context', 'technique', 'status'];

        order.forEach(key => {
            if (facets[key].size > 0) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'filter-group';
                const sortedValues = Array.from(facets[key]).sort();
                let optionsHtml = '';
                sortedValues.forEach(value => {
                    const inputId = `filter-${key}-${value.replace(/\s+/g, '-')}`;
                    optionsHtml += `
                        <label class="filter-option" for="${inputId}">
                            <input type="checkbox" id="${inputId}" value="${value}" data-category="${key}" onchange="GalleryLogic.toggleFilter('${key}', '${value}')">
                            <span class="checkmark"></span>
                            ${value}
                        </label>
                    `;
                });
                groupDiv.innerHTML = `<h4>${this.labels[key]}</h4><div class="filter-options">${optionsHtml}</div>`;
                wrapper.appendChild(groupDiv);
            }
        });
    },

    // --- NUEVA FUNCIÓN: ACTIVAR FILTRO POR NOMBRE (ROBUSTA) ---
    selectFilterByName: function(filterName) {
        if (!filterName) return;
        const normalizedName = filterName.trim().toLowerCase();
        
        // Buscamos el checkbox que corresponda
        const checkboxes = document.querySelectorAll('.filters-sidebar input[type="checkbox"]');
        let found = false;

        checkboxes.forEach(cb => {
            // Comparamos el valor del checkbox con el filtro de la URL
            if (cb.value.trim().toLowerCase() === normalizedName) {
                cb.checked = true; // Marcamos visualmente
                
                const category = cb.getAttribute('data-category');
                const value = cb.value; // Usamos el valor real del input
                
                // Actualizamos el estado interno
                if (this.activeFilters[category] && !this.activeFilters[category].includes(value)) {
                    this.activeFilters[category].push(value);
                }
                found = true;
            }
        });

        if (found) {
            console.log(`✅ Filtro "${filterName}" activado.`);
        } else {
            console.warn(`⚠️ No se encontró el filtro "${filterName}" en el sidebar.`);
        }
    },

    toggleFilter: function(category, value) {
        const index = this.activeFilters[category].indexOf(value);
        if (index === -1) this.activeFilters[category].push(value);
        else this.activeFilters[category].splice(index, 1);

        this.currentPage = 1;
        this.updateUI();
        this.renderAllProjects();
    },

    updateUI: function() {
        const totalFilters = Object.values(this.activeFilters).flat().length;
        const clearBtn = document.getElementById('clear-filters-btn');
        if(clearBtn) clearBtn.onclick = () => this.resetFilters();
        if(clearBtn) clearBtn.style.display = totalFilters > 0 ? 'block' : 'none';
    },

    resetFilters: function() {
        Object.keys(this.activeFilters).forEach(key => this.activeFilters[key] = []);
        document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
        this.currentPage = 1;
        this.updateUI();
        this.renderAllProjects();
    },

    // 2. RENDERIZADO (Filtrado Array vs Array)
    renderAllProjects: function() {
        const grid = document.getElementById('gallery-full-grid');
        const noResults = document.getElementById('no-results');
        const countLabel = document.getElementById('results-count');
        
        if (!grid) return;

        const filteredProjects = projectsData.filter(p => {
            if (!p.tags) return false;

            // Iteramos sobre las categorías del filtro (AND entre categorías)
            return Object.keys(this.activeFilters).every(category => {
                const activeOptions = this.activeFilters[category];
                
                // Si la categoría no tiene filtros activos, pasa
                if (activeOptions.length === 0) return true;
                
                // Obtenemos los tags del proyecto para esta categoría (asegurando array)
                const projectValues = Array.isArray(p.tags[category]) 
                    ? p.tags[category] 
                    : [p.tags[category]].filter(Boolean);

                // Verificamos coincidencia (OR dentro de la categoría: ¿Tiene ALGUNO de los seleccionados?)
                return activeOptions.some(opt => projectValues.includes(opt));
            });
        });

        if(countLabel) {
            countLabel.innerHTML = filteredProjects.length === projectsData.length 
                ? "Mostrando todos los proyectos" 
                : `<span style="color:#00e0e0">${filteredProjects.length}</span> resultados encontrados`;
        }

        // --- MANEJO DE RESULTADOS ---
        if (filteredProjects.length === 0) {
            grid.innerHTML = '';
            this.renderPaginationControls(0);
            
            if(noResults) {
                noResults.style.display = 'block';
                noResults.style.minHeight = '300px'; 
                gsap.fromTo(noResults, {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 0.4});
            }
            ScrollTrigger.refresh(); 
            return;
        } else {
            if(noResults) {
                noResults.style.display = 'none';
                noResults.style.minHeight = '0';
            }
        }

        // Paginación
        const totalPages = Math.ceil(filteredProjects.length / this.itemsPerPage);
        if (this.currentPage > totalPages) this.currentPage = 1;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const itemsToShow = filteredProjects.slice(startIndex, endIndex);

        grid.innerHTML = itemsToShow.map(p => {
            const displayTags = getFlatTags(p).slice(0, 3);
            
            return `
            <article class="work-card" onclick="window.location.href='project.html?id=${p.id}'">
                <div class="work-image">
                    <img src="${p.coverImage}" alt="${p.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/141414/00e0e0?text=No+Image'">
                </div>
                <div class="work-info">
                    <span class="work-cat">${p.category}</span>
                    <h3 class="work-title">${p.title}</h3>
                    <div class="work-tags">
                        ${displayTags.map(tag => `<span class="w-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
            `;
        }).join('');

        this.renderPaginationControls(totalPages);

        gsap.from("#gallery-full-grid .work-card", {
            y: 30, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", clearProps: "all"
        });

        ScrollTrigger.refresh();
    },

    // Generador de controles de paginación
    renderPaginationControls: function(totalPages) {
        let paginationContainer = document.getElementById('gallery-pagination');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'gallery-pagination';
            // Estilos inline para el contenedor (layout)
            paginationContainer.style.cssText = "display: flex; justify-content: center; align-items: center; padding-left: 3rem; gap: 1.5rem; margin-top: 3rem; padding-bottom: 2rem; width: 100%; grid-column: 1 / -1;";
            const grid = document.getElementById('gallery-full-grid');
            grid.parentNode.appendChild(paginationContainer);
        }

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        // HTML limpio usando la clase .pagination-btn definida en CSS
        paginationContainer.innerHTML = `
            <button class="pagination-btn" 
                ${this.currentPage === 1 ? 'disabled' : 'onclick="GalleryLogic.changePage(' + (this.currentPage - 1) + ')"'}
                aria-label="Anterior">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
            
            <span style="color: #ccc; font-weight: 600; font-family: 'Montserrat', sans-serif;">
                Página <span style="color: #00e0e0;">${this.currentPage}</span> de ${totalPages}
            </span>
            
            <button class="pagination-btn" 
                ${this.currentPage === totalPages ? 'disabled' : 'onclick="GalleryLogic.changePage(' + (this.currentPage + 1) + ')"'}
                aria-label="Siguiente">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        `;
    },

    changePage: function(newPage) {
        this.currentPage = newPage;
        this.renderAllProjects();
        const main = document.querySelector('.gallery-main');
        if(main) {
            const topPos = main.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
    }
};


/* ==========================================================================
   BLOQUE 3: LÓGICA GLOBAL (Shared)
   Se ejecuta en TODAS las páginas (Landing Y Proyectos).
   Aquí vive el CONTACTO, el MENÚ y el FOOTER.
   ========================================================================== */
const GlobalLogic = {
    init: function() {
        this.setupMenu();
        this.setupContactModal();     // ¡El contacto vive aquí para estar en todos lados!
        this.setupFooterAnimations();
        this.setupBackToTop();
        this.setupLightbox(); // Inicializar el lightbox
    },

    // MENÚ HAMBURGUESA
    setupMenu: function() {
        const header = document.querySelector('.main-header');
        const menuBtn = document.querySelector('.menu-toggle');
        const navLinks = document.querySelectorAll('.main-header nav a');

        if (!header || !menuBtn) return;

        // Clonamos el botón para eliminar eventos viejos y evitar duplicados
        const newMenuBtn = menuBtn.cloneNode(true);
        menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);

        const toggleMenu = () => {
            const isOpen = header.classList.toggle('open');
            newMenuBtn.setAttribute('aria-expanded', isOpen);
            newMenuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        };

        newMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => { setTimeout(() => header.classList.remove('open'), 80); });
        });

        // Cerrar al click fuera
        document.addEventListener('click', (e) => {
            if (header.classList.contains('open') && !header.contains(e.target)) {
                header.classList.remove('open');
                newMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                document.body.style.overflow = 'auto';
            }
        });
    },

    // MODAL DE CONTACTO (Funciona en Landing y en Proyecto si existe el modal)
    setupContactModal: function() {
        const modal = document.getElementById("contact-modal");
        
        // Seleccionamos cualquier botón que deba abrir el contacto
        const openBtns = document.querySelectorAll(".open-contact, #open-contact-btn");
        const closeBtn = document.querySelector(".close-contact");
        const form = document.getElementById("contact-form");
        const formStatus = document.querySelector(".form-status");

        // Si no hay modal en el HTML (ej: página que no lo tenga), no hacemos nada
        if(!modal) return;

        const openModal = (e) => {
            if(e) e.preventDefault();
            modal.style.display = "flex";
            document.body.style.overflow = "hidden"; // Evitar scroll de fondo
            gsap.fromTo(".contact-content", { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
        };

        const closeModal = () => {
            gsap.to(".contact-content", {
                opacity: 0, y: 40, scale: 0.95, duration: 0.4, ease: "power2.in",
                onComplete: () => {
                    modal.style.display = "none";
                    document.body.style.overflow = "auto";
                }
            });
        };

        // Asignar eventos
        openBtns.forEach(btn => btn.addEventListener('click', openModal));
        
        if(closeBtn) closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => { 
            if (e.target === modal) closeModal(); 
        });

        // Envío de Formulario
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Feedback visual inmediato
                const btnSubmit = form.querySelector('button[type="submit"]');
                const originalText = btnSubmit ? btnSubmit.innerText : "Enviar";
                if(btnSubmit) btnSubmit.innerText = "Enviando...";
                if(formStatus) formStatus.textContent = "Enviando mensaje...";

                if (typeof SITE_CONFIG === 'undefined') {
                    alert("Error de configuración: falta config.js");
                    return;
                }
                
                emailjs.sendForm(
                    SITE_CONFIG.emailjs.serviceId, 
                    SITE_CONFIG.emailjs.templateId, 
                    form
                )
                    .then(() => {
                        if(formStatus) formStatus.textContent = "✅ ¡Mensaje enviado con éxito!";
                        if(btnSubmit) btnSubmit.innerText = "Enviado";
                        form.reset();
                        setTimeout(() => {
                            closeModal();
                            if(btnSubmit) btnSubmit.innerText = originalText;
                            if(formStatus) formStatus.textContent = "";
                        }, 2500);
                    })
                    .catch((err) => {
                        console.error("Error EmailJS:", err);
                        if(formStatus) formStatus.textContent = "❌ Error al enviar. Intenta por Instagram.";
                        if(btnSubmit) btnSubmit.innerText = originalText;
                    });
            });
        }
    },

    setupFooterAnimations: function() {
        const footer = document.querySelector('.footer');
        if(footer) {
            gsap.from(".footer-content", {
                scrollTrigger: { trigger: ".footer", start: "top 80%", end: "top 50%", scrub: true },
                opacity: 0, y: 50, duration: 1.2, ease: "power2.out",
            });
        }
    },

    setupBackToTop: function() {
        const backToTop = document.getElementById("backToTop");
        if(backToTop){
            window.addEventListener("scroll", () => {
                backToTop.classList.toggle("visible", window.scrollY > 300);
            });
            backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        }
    },

    // --- NUEVO: SISTEMA DE LIGHTBOX REUTILIZABLE ---
    setupLightbox: function() {
        // Inyectar HTML si no existe
        if (!document.getElementById('lightbox')) {
            const lightboxDiv = document.createElement('div');
            lightboxDiv.id = 'lightbox';
            // Inicialmente en -10 para evitar bloqueos fantasma en móvil si la opacidad falla
            lightboxDiv.style.zIndex = '-10'; 
            lightboxDiv.innerHTML = `
                <div class="lightbox-container">
                    <button id="lightbox-close">&times;</button>
                    
                    <div class="lightbox-image-area">
                        <button class="lightbox-btn-float lightbox-prev-float" aria-label="Anterior"><i class="fa-solid fa-chevron-left"></i></button>
                        <img id="lightbox-img" src="" alt="Vista previa">
                        <button class="lightbox-btn-float lightbox-next-float" aria-label="Siguiente"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>

                    <div class="lightbox-panel">
                        <div class="lightbox-controls-bar">
                            <div class="lightbox-nav-group">
                                <button class="lightbox-btn-panel lightbox-prev-panel" aria-label="Anterior"><i class="fa-solid fa-chevron-left"></i></button>
                                <div class="lightbox-counter" id="lb-counter">1 / 1</div>
                                <button class="lightbox-btn-panel lightbox-next-panel" aria-label="Siguiente"><i class="fa-solid fa-chevron-right"></i></button>
                            </div>
                        </div>

                        <div class="lightbox-info-content">
                            <h3 class="lightbox-info-title" id="lb-title">Título</h3>
                            <p class="lightbox-info-desc" id="lb-desc">Descripción.</p>
                        </div>

                        <div class="lightbox-related" id="lb-related">
                            <h4>También te podría interesar:</h4>
                            <a href="#" class="related-card-mini" id="lb-related-link">
                                <img src="" alt="" class="related-mini-img" id="lb-related-img">
                                <div class="related-mini-info">
                                    <h5 id="lb-related-title">Nombre Proyecto</h5>
                                    <span id="lb-related-cat">Categoría</span>
                                </div>
                                <i class="fa-solid fa-arrow-right" style="color: #666; font-size: 0.8rem; margin-left: auto;"></i>
                            </a>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(lightboxDiv);
        }

        const lightbox = document.getElementById('lightbox');
        const imgArea = document.querySelector('.lightbox-image-area');
        const lbImg = document.getElementById('lightbox-img');
        const lbTitle = document.getElementById('lb-title');
        const lbDesc = document.getElementById('lb-desc');
        const lbCounter = document.getElementById('lb-counter');
        const lbRelatedSection = document.getElementById('lb-related');
        const lbRelatedLink = document.getElementById('lb-related-link');
        const lbRelatedImg = document.getElementById('lb-related-img');
        const lbRelatedTitle = document.getElementById('lb-related-title');
        const lbRelatedCat = document.getElementById('lb-related-cat');
        
        let currentGallery = [];
        let currentIndex = 0;
        let isZoomed = false;

        const resetZoom = () => { isZoomed = false; lbImg.classList.remove('zoomed'); lbImg.style.transformOrigin = 'center center'; };
        
        const toggleZoom = (e) => {
            if(e.target !== lbImg && e.target !== imgArea) return;
            isZoomed = !isZoomed;
            if(isZoomed) {
                lbImg.classList.add('zoomed');
                const rect = imgArea.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                lbImg.style.transformOrigin = `${x}% ${y}%`;
            } else {
                lbImg.classList.remove('zoomed');
                setTimeout(() => { if(!isZoomed) lbImg.style.transformOrigin = 'center center'; }, 300);
            }
        };

        const handlePan = (e) => {
            if(!isZoomed) return;
            const rect = imgArea.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            lbImg.style.transformOrigin = `${x}% ${y}%`;
        };

        const updateLightboxContent = () => {
            const imgEl = currentGallery[currentIndex];
            if(!imgEl) return;
            resetZoom();
            lbImg.classList.remove('loaded');
            setTimeout(() => {
                lbImg.src = imgEl.src;
                const title = imgEl.getAttribute('data-title') || "Detalle";
                const desc = imgEl.getAttribute('data-desc') || "";
                lbTitle.textContent = title;
                lbDesc.textContent = desc;
                lbCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
                lbImg.onload = () => lbImg.classList.add('loaded');
            }, 200);
        };

        const openLightbox = (index, gallery) => {
            currentGallery = gallery;
            currentIndex = index;
            updateLightboxContent();
            
            if (ProjectLogic && ProjectLogic.bestRelatedProject) {
                const best = ProjectLogic.bestRelatedProject;
                lbRelatedTitle.textContent = best.title;
                lbRelatedCat.textContent = best.category;
                lbRelatedImg.src = best.coverImage;
                lbRelatedLink.href = `project.html?id=${best.id}`;
                lbRelatedSection.style.display = "block";
            } else {
                lbRelatedSection.style.display = "none";
            }

            // --- GESTIÓN DE Z-INDEX RESPONSIVE ---
            const width = window.innerWidth;
            if (width <= 900) { // Si es tablet o móvil
                lightbox.style.zIndex = '9999'; // Traer al frente
            } else {
                lightbox.style.zIndex = '2000'; // Valor desktop por defecto
            }

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => { 
            lightbox.classList.remove('active'); 
            
            // Retrasar el z-index negativo para que termine la transición de opacidad
            setTimeout(() => {
                lightbox.style.zIndex = '-10'; 
            }, 300); // 300ms = duración de la transición CSS
            
            document.body.style.overflow = 'auto'; 
            resetZoom(); 
        };

        const nextImage = (e) => { if(e) e.stopPropagation(); currentIndex = (currentIndex + 1) % currentGallery.length; updateLightboxContent(); };
        const prevImage = (e) => { if(e) e.stopPropagation(); currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; updateLightboxContent(); };

        // Listeners
        document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
        
        const nextBtns = document.querySelectorAll('.lightbox-next-float, .lightbox-next-panel');
        const prevBtns = document.querySelectorAll('.lightbox-prev-float, .lightbox-prev-panel');
        nextBtns.forEach(btn => btn.addEventListener('click', nextImage));
        prevBtns.forEach(btn => btn.addEventListener('click', prevImage));
        
        imgArea.addEventListener('click', toggleZoom);
        imgArea.addEventListener('mousemove', handlePan);
        
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });

        document.addEventListener('click', (e) => {
            const targetImg = e.target.closest('.zoomable-img');
            if (targetImg) {
                const galleryContainer = targetImg.closest('.gallery-grid') || document.body;
                const galleryImages = Array.from(galleryContainer.querySelectorAll('.zoomable-img'));
                const index = galleryImages.indexOf(targetImg);
                if (index !== -1) {
                    openLightbox(index, galleryImages);
                }
            }
        });
    }
  };

/* ==========================================================================
   EJECUCIÓN MAESTRA (ROUTER)
   Decide qué lógica cargar según la página.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SIEMPRE cargar Lógica Global (Menú, Contacto, Footer)
    // Esto asegura que el contacto funcione en la Landing Page
    GlobalLogic.init();

    // 2. Detectar si estamos en Proyecto o en Landing
    const projectContainer = document.getElementById('project-container');
    const galleryContainer = document.getElementById('gallery-full-grid'); // Nuevo ID de la galería
    
    if (projectContainer) {
        // --- ESTAMOS EN UN PROYECTO ---
        ProjectLogic.init();
    } else if (galleryContainer) {
        GalleryLogic.init(); // Página de Galería
    } else {
        // --- ESTAMOS EN LA LANDING PAGE ---
        LandingLogic.init();
    }
});
