/* data.js */
const projectsData = [
    {
        id: "lagasai",
        title: "Lagasai",
        category: "Ilustración 2D",
        featured: true,
        coverImage: "Projects/Lagasai/RenderPortada.jpg", // Tu imagen del home
        tags: {
            type: ["Concept Art", "Ilustración"], //Define para que se hizo el proyecto
            focus: ["Character Design", "Técnico"], //Define que estaba intentando resolver
            context: ["Personal"], //Por que existe y bajo que restricciones
            technique: ["Ilustración 2D"], //Tecnica y herramientas
            status: ["Terminado"] //Terminado, en pausa, en proceso, cancelado...
        },
        
        // DATOS NUEVOS PARA LA PÁGINA INTERNA
        heroImage: "Projects/Lagasai/RenderPortada.jpg", // Puede ser la misma o una versión wide
        year: "2025",
        role: "Concept Artist",
        description: "Exploración y diseño de personaje con enfoque de producción hacía el 3D",
        tools: ["Photoshop"],
        links: {
            artstation: "https://www.artstation.com/artwork/rlQ64J"
        },
        // Array de imágenes internas (Proceso)
         gallery: [
            // Opción A: Objeto completo (Recomendado para el nuevo lightbox)
            { 
                src: "Projects/Lagasai/RenderFinal.jpg", 
                caption: "Render final - Lagasai", 
                desc: "Resultado final luego de las iteraciones y estudios mostrados anteriormente"
            },
            { 
                src: "Projects/Lagasai/ColorStudies.png", 
                caption: "Estudios de color", 
                desc: "Una vez entendida la tridimensionalidad del diseño, se procedió a hacer un estudio de color buscando la mejor paleta cromática."
            },
            { 
                src: "Projects/Lagasai/casco.jpg", 
                caption: "Estudio del casco", 
                desc: "Turn around y estudio del desglose del prop buscando entender su funcionamiento y tridimensionalidad."
            },
            { 
                src: "Projects/Lagasai/mascara.jpg", 
                caption: "Estudio de la máscara", 
                desc: "Turn around y estudio del desglose del prop buscando entender su funcionamiento y tridimensionalidad."
            },
            { 
                src: "Projects/Lagasai/TAround.jpg", 
                caption: "Turn around del personaje", 
                desc: "Exploración de volumen y diseño cuando tiene props y cuando no tiene props el personaje."
            },
            { 
                src: "Projects/Lagasai/bocetosForma.png", 
                caption: "Bocetos explorativos de forma", 
                desc: "Exploración en diseños y siluetas con mínimo detalle interno."
            },
            { 
                src: "Projects/Lagasai/Moodboard.jpg", 
                caption: "Moodboard", 
                desc: "Referencias visuales usadas para inspiración en el proyecto, y recopiladas de plataformas como Arstation y Pinterest, los créditos de cada imagen pertenecen a sus respectivos autores."
            }
        ]   
    },
    {
        id: "harmonicsilence",
        title: "Harmonic Silence",
        category: "Concept Art",
        featured: true,
        coverImage: "Projects/HarmonicSilence/BANNER.jpg", // Tu imagen del home
        tags: {
            type: ["Concept Art", "Estudio"], //Define para que se hizo el proyecto
            focus: ["Character Design", "Gaming", "Mood y Atmosfera"], //Define que estaba intentando resolver
            context: ["GameJam"], //Por que existe y bajo que restricciones
            technique: ["Pixel Art"], //Tecnica y herramientas
            status: ["Terminado"] //Terminado, en pausa, en proceso, cancelado...
        },
        
        // DATOS NUEVOS PARA LA PÁGINA INTERNA
        heroImage: "Projects/HarmonicSilence/BackGroundFull.png", // Puede ser la misma o una versión wide
        year: "2025",
        role: "GameDev",
        description: "Videojuego realizado para la GameOff2025 que explora el universo corrompido por un cientifico loco que logra control total sobre todas las ondas, desde las sonoras, hasta las cerebrales. Y donde el jugador será una anomalia que este cientifico no podrá controlar",
        tools: ["Photoshop", "Unity", "Audacity"],
        links: {
            itch: "https://jadzzon.itch.io/harmonic-silence"
        },
        // Array de imágenes internas (Proceso)
         gallery: [
            // Opción A: Objeto completo (Recomendado para el nuevo lightbox)
            { 
                src: "Projects/HarmonicSilence/GameplayMockup.png", 
                caption: "Mockup del Gameplay", 
                desc: "Imagen que busca retratar el gameplay real del videojuego, mostrando el diseño de UI en contexto, asi como algunos frames de animaciones varias. Se busco recrear en la UI lo que sería la interfaz de una sala de control, como si el jugador fuese un sujeto de pruebas bajo un entorno controlado"
            },
            { 
                src: "Projects/HarmonicSilence/ShopMockup.png", 
                caption: "Mockup de la tienda", 
                desc: "Imagen que busca retratar la segunda pantalla más importante del gameplay, mostrando el diseño que busca simular la pantalla de una terminal de mejoras a la que el jugador accederá despues de cada ronda, como un premio por sobrevivir"
            },
            { 
                src: "Projects/HarmonicSilence/BackgroundDesglose.png", 
                caption: "Desglose del Background", 
                desc: "Pensado para ser usado como un fondo parallax, con múltiples pistas sobre la historia y contexto sobre el cual el videojuego y su universo se desarrollan"
            },
            { 
                src: "Projects/HarmonicSilence/ENEMIES.jpg", 
                caption: "Desglose de los enemigos", 
                desc: "Se busca mostrar a todos los enemigos creados para este proyecto, en el cual cada uno de ellos cumple un rol. Siendo el murcielago un enemigo molesto que castiga a los jugadores que no miran arriba, el zombie un enemigo débil que castiga a aquel que lo deje unirse en masa, el gorila uno que castiga a quien no cuida su espacio alrededor, y el mutante uno que castiga a aquel que no está atento a sus alrededores por trampas"
            },
            { 
                src: "Projects/HarmonicSilence/PlayerMockup.png", 
                caption: "Sprite del jugador", 
                desc: "Se busca mostrar la versatilidad de este sprite, diseñado para sentirse rebelde o fuera de lugar en un mundo al que no pertenece por ser una anomalia, pero al mismo tiempo sentirse como un ser humano común."
            },
            { 
                src: "Projects/HarmonicSilence/IconsRecap.png", 
                caption: "Recopilación de algunos de los íconos de la tienda", 
                desc: "Cada uno buscando describir el rol del item al que representan."
            },
            { 
                src: "Projects/HarmonicSilence/REFS.jpg", 
                caption: "Moodboard", 
                desc: "Referencias visuales usadas para inspiración en el proyecto, y recopiladas de plataformas como Arstation y Pinterest, los créditos de cada imagen pertenecen a sus respectivos autores."
            }
        ]   
    },
    {
        id: "pixelart-portraits",
        title: "Retratos Pixel Art",
        category: "Pixel Art",
        featured: true,
        coverImage: "Projects/PixelArtPortraits/ILIAN_CARTA.jpg", // Tu imagen del home
        tags: {
            type: ["Estudio", "Ilustración"], //Define para que se hizo el proyecto
            focus: ["Character Design", "Color y Luz"], //Define que estaba intentando resolver
            context: ["Personal"], //Por que existe y bajo que restricciones
            technique: ["Pixel Art"], //Tecnica y herramientas
            status: ["Terminado"] //Terminado, en pausa, en proceso, cancelado...
        },
        
        // DATOS NUEVOS PARA LA PÁGINA INTERNA
        heroImage: "Projects/PixelArtPortraits/ILIAN_CARTA.jpg", // Puede ser la misma o una versión wide
        year: "2025",
        role: "Ilustrador",
        description: "Exploración artística de retratos de familiares bajo la técnica de pixel art estilizado, fuerón diseñados para ser impresos en tamaño carta",
        tools: ["Photoshop"],
        links: {
            artstation: "https://www.artstation.com/artwork/JrNmQa"
        },
        // Array de imágenes internas (Proceso)
         gallery: [
            // Opción A: Objeto completo (Recomendado para el nuevo lightbox)
            { 
                src: "Projects/PixelArtPortraits/ILIAN_CARTA.jpg", 
                caption: "Mi hermana", 
                desc: "Niña de 15 años, busque explotar el parecido que tiene con su madre junto con su juventud."
            },
            { 
                src: "Projects/PixelArtPortraits/ANDRES_CARTA.jpg", 
                caption: "Mi tio", 
                desc: "Hombre de 30 años, busque explorar el efecto de los accesorios que suele usar (gorra, lentes)."
            },
            { 
                src: "Projects/PixelArtPortraits/SANDRA_CARTA.jpg", 
                caption: "Mi madre", 
                desc: "Mujer de 40 años, busque explotar el parecido que tiene con mi hermana a pesar de su edad."
            },
            { 
                src: "Projects/PixelArtPortraits/RICHARD_CARTA.jpg", 
                caption: "Mi padre", 
                desc: "Hombre de 50 años, busque explotar el efecto que tiene su color de piel, al ser el único con este en la colección."
            },
            { 
                src: "Projects/PixelArtPortraits/MARIA_CARTA.jpg", 
                caption: "Mi abuela", 
                desc: "Mujer de 70 años, busque explotar la belleza que hay en ella a pesar de su edad."
            },
            { 
                src: "Projects/PixelArtPortraits/autoretratoHD.png", 
                caption: "Mi autoretrato", 
                desc: "Hombre de 20 años, busque estudiar como se comportan mis características únicas. En este ultimo busque eliminar el borde negro típico del Pixel Art clásico para permitir que la rim light funcionara mejor."
            }
        ]   
    },
    {
        id: "silentawakening",
        title: "Silent Awakening",
        category: "Esculpido 3D",
        featured: false,
        coverImage: "Projects/SilentAwakening/r4.png", // Tu imagen del home
        tags: {
            type: ["Concept Art", "Estudio"], //Define para que se hizo el proyecto
            focus: ["Character Design", "Mood y Atmosfera"], //Define que estaba intentando resolver
            context: ["Personal"], //Por que existe y bajo que restricciones
            technique: ["Esculpido 3D"], //Tecnica y herramientas
            status: ["Terminado"] //Terminado, en pausa, en proceso, cancelado...
        },
        
        // DATOS NUEVOS PARA LA PÁGINA INTERNA
        heroImage: "Projects/SilentAwakening/r4.png", // Puede ser la misma o una versión wide
        year: "2025",
        role: "Concept Artist",
        description: "Exploración y diseño de personaje con enfoque en transmitir un mood oscuro y explorar distintas herramientas",
        tools: ["Maya", "Mudbox", "Substance Painter","Photoshop"],
        links: {
            artstation: "https://www.artstation.com/artwork/ZlW2l0?notification_id=7325741606"
        },
        // Array de imágenes internas (Proceso)
         gallery: [
            // Opción A: Objeto completo (Recomendado para el nuevo lightbox)
            { 
                src: "Projects/SilentAwakening/r1.png", 
                caption: "Render principal", 
                desc: "Render buscando contar una historia"
            },
            { 
                src: "Projects/SilentAwakening/r2.png", 
                caption: "Mouth Closeup", 
                desc: "Render cercano, buscando mostrar complejidad técnica."
            },
            { 
                src: "Projects/SilentAwakening/r3.png", 
                caption: "Eye Closeup", 
                desc: "Render cercano, buscando mostrar detalle."
            },
            { 
                src: "Projects/SilentAwakening/r4.png", 
                caption: "Eyes Closeup", 
                desc: "Render cercano, buscando generar peligro"
            },
            { 
                src: "Projects/SilentAwakening/r5.png", 
                caption: "Shoulder view", 
                desc: "Render desde ángulo trasero, buscando transmitir misterio"
            },
            { 
                src: "Projects/SilentAwakening/rt.png", 
                caption: "Render técnico", 
                desc: "Render con enfoque en mostrar la silueta y topologia base."
            }
        ]   
    },    
];