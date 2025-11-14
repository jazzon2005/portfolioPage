emailjs.init("6tWlpwdpwxArjf5dh");

gsap.registerPlugin(ScrollTrigger);

// === Animaciones para la sección "Sobre mí" ===
// Detectar si estamos en móvil
const isMobile = window.innerWidth <= 480;

if (isMobile) {
  // En móvil: animar primero la imagen (order: 1)
  gsap.fromTo(".about-image", 
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about-image",
        start: "top 80%",
        end: "top 50%",
        scrub: true,
      }
    }
  );

  // Luego el texto (order: 2)
  gsap.fromTo(".about-text", 
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about-text",
        start: "top 85%",
        end: "top 50%",
        scrub: true,
      }
    }
  );
} else {
  // En desktop: orden original (texto primero)
  gsap.fromTo(".about-text", 
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about-text",
        start: "top 80%",
        end: "top 50%",
        scrub: true,
      }
    }
  );

  gsap.fromTo(".about-image", 
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about-image",
        start: "top 85%",
        end: "top 50%",
        scrub: true,
      }
    }
  );
}

// Animación inicial del hero
gsap.from(".hero-text", {
  opacity: 0,
  y: 80,
  duration: 1.4,
  ease: "power3.out",
});

gsap.from(".hero-image img", {
  opacity: 0,
  y: 100,
  scale: 1.3,
  duration: 1.6,
  ease: "power3.out",
  delay: 0.2,
});

// Parallax suave al hacer scroll
gsap.to(".hero-image img", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
  yPercent: -15,
  ease: "none",
});

// Fade-in de los trabajos
gsap.utils.toArray(".work-card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      end: "top 60%",
      scrub: true,
    },
    opacity: 0,
    y: 60,
    duration: 1.2,
    delay: i * 0.1,
    ease: "power2.out",
  });
});

// === Animaciones para la sección "Sobre mí" ===
gsap.registerPlugin(ScrollTrigger);

gsap.fromTo(".about-text", 
  { opacity: 0, y: 80 },
  {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about-text",
      start: "top 80%",
      end: "top 50%",
      scrub: true,
    }
  }
);

gsap.fromTo(".about-image", 
  { opacity: 0, y: 80 },
  {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about-image",
      start: "top 85%",
      end: "top 50%",
      scrub: true,
    }
  }
);

// === Animaciones scroll para la sección sticky de contacto ===
// === Efecto "scroll local" tipo Chevalier ===
gsap.registerPlugin(ScrollTrigger);

// === Animaciones scroll para la sección sticky de contacto ===
gsap.utils.toArray(".help-item").forEach((item, i) => {
  gsap.fromTo(
    item,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        end: "bottom 75%",
        toggleActions: "play none none reverse", // evita que se prolongue
      },
    }
  );
});


// === Animación de aparición del footer ===
gsap.from(".footer-content", {
  scrollTrigger: {
    trigger: ".footer",
    start: "top 80%",
    end: "top 50%",
    scrub: true,
  },
  opacity: 0,
  y: 100,
  duration: 1.2,
  ease: "power2.out",
});

const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 200);
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===========================================================
// MENU ACTIVO SEGÚN SCROLL
// ===========================================================

// 1. Seleccionamos todas las secciones que tienen ID y los enlaces del menú
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".main-header nav ul li a");

// 2. Configuramos un observador de intersección
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const navItem = document.querySelector(`.main-header a[href="#${id}"]`);

      if (entry.isIntersecting) {
        // Remueve estado activo de todos
        navLinks.forEach((link) => link.classList.remove("active"));
        // Activa solo el correspondiente
        if (navItem) navItem.classList.add("active");
      }
    });
  },
  {
    root: null,
    threshold: 0.5, // el 50% de la sección visible activa el enlace
  }
);

// 3. Observa cada sección
sections.forEach((section) => observer.observe(section));

// ===========================================================
// MODAL DE GALERÍA CON NAVEGACIÓN
// ===========================================================

// Datos de galería: una por categoría (cada imagen con su info)
const galleries = {
  "Escultura 3D": {
    images: [
      {
        src: "images/juan-acosta-pena-r4.jpg",
        title: "Despertar silencioso",
        description: "La escultura emerge desde las sombras de la muerte."
      },
      {
        src: "images/juan-acosta-pena-r2.jpg",
        title: "Eco del pasado",
        description: "Una figura atrapada entre la vida y la eternidad."
      },
      {
        src: "images/juan-acosta-pena-r1.jpg",
        title: "Llamado oscuro",
        description: "Una entidad que nunca debió volver."
      }
    ]
  },

  "Concept Art": {
    images: [
      {
        src: "images/juan-acosta-pena-final_nt.jpg",
        title: "Lagasai – final",
        description: "Guerrero listo para sacrificarse por su mundo Lagao-pon."
      },
      {
        src: "images/juan-acosta-pena-final_nt_2.jpg",
        title: "Lagasai – exploración color",
        description: "Un estudio de como debería sentirse."
      },
      {
        src: "images/juan-acosta-pena-final_nt_3.jpg",
        title: "Lagasai – exploración forma",
        description: "Un vistazo a como debería verse."
      }
    ]
  },

  "Modelado": {
    images: [
      {
        src: "images/juan-acosta-pena-render-v04.jpg",
        title: "Cuarto – primer plano",
        description: "El caos de un estudiante sin dormir lo suficiente."
      },
      {
        src: "images/juan-acosta-pena-render-v03.jpg",
        title: "Cuarto – topdown",
        description: "Vista del cuarto general."
      },
      {
        src: "images/juan-acosta-pena-render-v02.jpg",
        title: "Cuarto – vista exterior",
        description: "Vista general de composición."
      }
    ]
  }
};

const modal = document.getElementById("gallery-modal");
const modalTitle = modal.querySelector(".gallery-title");
const modalDesc = modal.querySelector(".gallery-description");
const modalImage = modal.querySelector(".gallery-image");
const closeModal = modal.querySelector(".close-modal");
const prevBtn = modal.querySelector(".prev");
const nextBtn = modal.querySelector(".next");

let currentGallery = null;
let currentIndex = 0;

// Mostrar imagen actual (con su título y descripción propios)
function showImage(index) {
  const gallery = galleries[currentGallery];
  if (!gallery) return;

  currentIndex = (index + gallery.images.length) % gallery.images.length;

  const imgData = gallery.images[currentIndex];

  modalImage.src = imgData.src;
  modalTitle.textContent = imgData.title;
  modalDesc.textContent = imgData.description;

  // Animación de transición suave
  gsap.fromTo(
    modalImage,
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
  );
}

// Abrir modal al hacer click en cada tarjeta
document.querySelectorAll(".work-card").forEach(card => {
  card.addEventListener("click", () => {
    currentGallery = card.querySelector("h3").textContent.trim();
    currentIndex = 0;
    showImage(currentIndex);

    modal.style.display = "flex";
    gsap.fromTo(
      modal.querySelector(".gallery-content"),
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
    );
    document.body.style.overflow = "hidden";
  });
});

// Cerrar modal
function closeGallery() {
  gsap.to(modal.querySelector(".gallery-content"), {
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.4,
    ease: "power2.in",
    onComplete: () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

closeModal.addEventListener("click", closeGallery);
modal.addEventListener("click", e => {
  if (e.target === modal) closeGallery();
});

// Navegación de imágenes
prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
nextBtn.addEventListener("click", () => showImage(currentIndex + 1));


// ===========================================================
// MODAL DE CONTACTO
// ===========================================================

const contactModal = document.getElementById("contact-modal");
const openContactBtn = document.querySelector(".open-contact");
const closeContactBtn = document.querySelector(".close-contact");
const contactForm = document.getElementById("contact-form");
const formStatus = document.querySelector(".form-status");

// Abrir modal de contacto
openContactBtn.addEventListener("click", (e) => {
  e.preventDefault();
  contactModal.style.display = "flex";
  document.body.style.overflow = "hidden";
  gsap.fromTo(
    ".contact-content",
    { opacity: 0, y: 40, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
  );
});

// Cerrar modal
function closeContact() {
  gsap.to(".contact-content", {
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.4,
    ease: "power2.in",
    onComplete: () => {
      contactModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}
closeContactBtn.addEventListener("click", closeContact);
contactModal.addEventListener("click", e => {
  if (e.target === contactModal) closeContact();
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  formStatus.textContent = "Enviando mensaje...";

  emailjs.sendForm("service_0sdcvta", "template_u5wdm68", contactForm)
    .then(() => {
      formStatus.textContent = "✅ Mensaje enviado correctamente. ¡Gracias por contactarme!";
      contactForm.reset();
    })
    .catch((error) => {
      console.error("Error:", error);
      formStatus.textContent = "❌ Hubo un problema al enviar el mensaje.";
    });
});



// MENU HAMBURGER MOBILE RESPONSIVE
(function () {
  const header = document.querySelector('.main-header');
  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.main-header nav a');

  if (!header || !menuBtn) return;

  const openMenu = () => {
    header.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    header.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.style.overflow = 'auto';
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    header.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Cerrar al click en cualquier enlace del menú (útil para navegación interna)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // pequeño delay para que el click haga scroll antes de cerrar si es anchor
      setTimeout(closeMenu, 80);
    });
  });

  // Cerrar con Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('open')) closeMenu();
  });

  // Cerrar si el usuario hace click fuera (fuera del nav abierto)
  document.addEventListener('click', (e) => {
    if (!header.classList.contains('open')) return;
    // si el click no fue dentro del nav ni sobre el botón, cerramos
    const withinHeader = header.contains(e.target);
    if (!withinHeader) closeMenu();
  });
})();

