const URL_DATOS = './lista.txt';
let todosLosJuegos = [];

// Cargar datos
async function cargarDatos() {
    try {
        const respuesta = await fetch(URL_DATOS);
        todosLosJuegos = await respuesta.json();

        // Banner con un juego aleatorio
        mostrarHero(todosLosJuegos[Math.floor(Math.random() * todosLosJuegos.length)]);

        // Generar filtros dinámicamente desde los géneros del JSON
        generarFiltros(todosLosJuegos);

        // Renderizar catálogo
        renderizarCatalogo(todosLosJuegos);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('catalogo').innerHTML = '<p>Error al cargar el catálogo.</p>';
    }
}

// Banner destacado
function mostrarHero(juego) {
    document.getElementById('hero-titulo').textContent = juego.titulo;
    document.getElementById('hero-sinopsis').textContent = juego.sinopsis;

    // Imagen de fondo del hero
    const urlImagen = `https://art.gametdb.com/switch/box/${juego.region}/${juego.id}.png`;
    const hero = document.getElementById('hero');
    const img = new Image();
    img.onload = () => {
        hero.style.backgroundImage = `linear-gradient(0deg, #0f0c29 0%, rgba(15,12,41,0.5) 50%, transparent 100%), url('${urlImagen}')`;
    };
    img.src = urlImagen;
}

// Generar botones de filtro desde los géneros reales del JSON
function generarFiltros(juegos) {
    const contenedor = document.getElementById('filtros');
    const generosSet = new Set();

    juegos.forEach(j => {
        (j.genero || []).forEach(g => generosSet.add(g));
    });

    // Ordenar alfabéticamente y limitar a los más comunes
    const generos = Array.from(generosSet).sort();

    generos.forEach(genero => {
        const btn = document.createElement('button');
        btn.className = 'filtro-btn';
        btn.dataset.genero = genero;
        btn.textContent = genero;
        contenedor.appendChild(btn);
    });

    // Asignar evento a todos los botones (incluido "Todos")
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');

            const genero = btn.dataset.genero;
            if (genero === 'todos') {
                renderizarCatalogo(todosLosJuegos);
            } else {
                const filtrados = todosLosJuegos.filter(j =>
                    (j.genero || []).some(g => g.toLowerCase() === genero.toLowerCase())
                );
                renderizarCatalogo(filtrados);
            }
        });
    });
}

// Renderizar tarjetas
function renderizarCatalogo(juegos) {
    const catalogo = document.getElementById('catalogo');
    catalogo.innerHTML = '';

    juegos.forEach(juego => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';
        tarjeta.onclick = () => abrirModal(juego);

        // Construir URL de la portada con region e id
        const urlImagen = `https://art.gametdb.com/switch/box/${juego.region}/${juego.id}.png`;

        tarjeta.innerHTML = `
            <div class="tarjeta-imagen">
                <img src="${urlImagen}" alt="${juego.titulo}" loading="lazy"
                     onerror="this.style.display='none'; this.parentElement.innerHTML='🎮';">
            </div>
            <div class="tarjeta-info">
                <h3>${juego.titulo}</h3>
                <div class="tarjeta-meta">
                    <span>${juego.lanzamiento || 'N/A'}</span>
                    <span>${juego.region || ''}</span>
                </div>
                <div class="tarjeta-generos">
                    ${(juego.genero || []).map(g => `<span class="genero-tag">${g}</span>`).join('')}
                </div>
            </div>
        `;
        catalogo.appendChild(tarjeta);
    });
}

// Modal
function abrirModal(juego) {
    const urlImagen = `https://art.gametdb.com/switch/box/${juego.region}/${juego.id}.png`;

    document.getElementById('modal-imagen').innerHTML =
        `<img src="${urlImagen}" alt="${juego.titulo}" onerror="this.parentElement.innerHTML='🎮';">`;

    document.getElementById('modal-titulo').textContent = juego.titulo;
    document.getElementById('modal-info').innerHTML =
        `<strong>Plataforma:</strong> ${juego.plataforma || 'N/A'}<br>
         <strong>Año:</strong> ${juego.lanzamiento || 'N/A'}<br>
         <strong>Géneros:</strong> ${(juego.genero || []).join(', ')}<br>
         <strong>Región:</strong> ${juego.region || 'N/A'}<br>
         <strong>Estado:</strong> ${juego.estado || 'N/A'}`;
    document.getElementById('modal-sinopsis').textContent = juego.sinopsis;
    document.getElementById('modal').classList.add('activo');
}

function cerrarModal() {
    document.getElementById('modal').classList.remove('activo');
}

function scrollToCatalogo() {
    document.querySelector('.seccion-titulo').scrollIntoView({ behavior: 'smooth' });
}

// Buscador
document.getElementById('buscador').addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = todosLosJuegos.filter(j =>
        j.titulo.toLowerCase().includes(texto) ||
        (j.sinopsis && j.sinopsis.toLowerCase().includes(texto))
    );
    renderizarCatalogo(filtrados);
});

// Cerrar modal al clic fuera
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') cerrarModal();
});

// Iniciar
document.addEventListener('DOMContentLoaded', cargarDatos);
