const URL_DATOS = 'https://raw.githubusercontent.com/cl6rfp/Juegos-Swich/refs/heads/main/lista.txt';
let todosLosJuegos = [];

// Cargar datos
async function cargarDatos() {
    try {
        const respuesta = await fetch(URL_DATOS);
        todosLosJuegos = await respuesta.json();
        
        // Banner con un juego aleatorio
        mostrarHero(todosLosJuegos[Math.floor(Math.random() * todosLosJuegos.length)]);
        
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
    document.getElementById('hero').style.backgroundImage = 
        `linear-gradient(135deg, #2a0a0a, #1a1a1a), radial-gradient(circle at 30% 50%, rgba(229,9,20,0.3), transparent)`;
}

// Renderizar tarjetas
function renderizarCatalogo(juegos) {
    const catalogo = document.getElementById('catalogo');
    catalogo.innerHTML = '';

    juegos.forEach(juego => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';
        tarjeta.onclick = () => abrirModal(juego);

        const emoji = obtenerEmoji(juego.genero);

        tarjeta.innerHTML = `
            <div class="tarjeta-imagen">${emoji}</div>
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

// Emoji según género
function obtenerEmoji(generos) {
    if (!generos) return '🎮';
    const g = generos.join(' ').toLowerCase();
    if (g.includes('terror')) return '👻';
    if (g.includes('rpg')) return '⚔️';
    if (g.includes('carreras')) return '🏎️';
    if (g.includes('lucha')) return '🥊';
    if (g.includes('plataformas')) return '🍄';
    if (g.includes('metroidvania')) return '🗡️';
    if (g.includes('ritmo')) return '🎵';
    if (g.includes('deportes')) return '⚽';
    if (g.includes('puzles')) return '🧩';
    if (g.includes('aventura')) return '🗺️';
    return '🎮';
}

// Modal
function abrirModal(juego) {
    document.getElementById('modal-titulo').textContent = juego.titulo;
    document.getElementById('modal-info').innerHTML = 
        `<strong>Plataforma:</strong> ${juego.plataforma || 'N/A'}<br>
         <strong>Año:</strong> ${juego.lanzamiento || 'N/A'}<br>
         <strong>Géneros:</strong> ${(juego.genero || []).join(', ')}<br>
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

// Filtros por género
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        
        const genero = btn.dataset.genero;
        if (genero === 'todos') {
            renderizarCatalogo(todosLosJuegos);
        } else {
            const filtrados = todosLosJuegos.filter(j => 
                (j.genero || []).some(g => g.toLowerCase().includes(genero.toLowerCase()))
            );
            renderizarCatalogo(filtrados);
        }
    });
});

// Cerrar modal al clic fuera
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') cerrarModal();
});

// Iniciar
document.addEventListener('DOMContentLoaded', cargarDatos);
