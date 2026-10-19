const URL_DATOS = './lista.txt';
let todosLosJuegos = [];

async function cargarDatos() {
    try {
        const respuesta = await fetch(URL_DATOS);
        todosLosJuegos = await respuesta.json();

        mostrarHero(todosLosJuegos[Math.floor(Math.random() * todosLosJuegos.length)]);
        generarFiltros(todosLosJuegos);
        renderizarCatalogo(todosLosJuegos);
        
        // Contador de juegos
        document.getElementById('contador-juegos').textContent = `${todosLosJuegos.length} Juegos`;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('catalogo').innerHTML = '<p style="padding: 20px;">Error al cargar el catálogo. Revisa que lista.txt sea un JSON válido y no esté cortado.</p>';
    }
}

function mostrarHero(juego) {
    document.getElementById('hero-titulo').textContent = juego.titulo;
    document.getElementById('hero-sinopsis').textContent = juego.sinopsis;

    const urlImagen = `https://art.gametdb.com/switch/coverfullHQ/${juego.region}/${juego.id}.jpg`;
    const hero = document.getElementById('hero');
    const img = new Image();
    img.onload = () => {
        hero.style.backgroundImage = `linear-gradient(0deg, #0f0c29 0%, rgba(15,12,41,0.6) 50%, transparent 100%), url('${urlImagen}')`;
    };
    img.src = urlImagen;
}

function generarFiltros(juegos) {
    const select = document.getElementById('select-genero');
    const generosSet = new Set();

    juegos.forEach(j => {
        (j.genero || []).forEach(g => generosSet.add(g));
    });

    const generos = Array.from(generosSet).sort();

    generos.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero;
        option.textContent = genero;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        const genero = e.target.value;
        if (genero === 'todos') {
            renderizarCatalogo(todosLosJuegos);
        } else {
            const filtrados = todosLosJuegos.filter(j =>
                (j.genero || []).some(g => g.toLowerCase() === genero.toLowerCase())
            );
            renderizarCatalogo(filtrados);
        }
    });
}

function renderizarCatalogo(juegos) {
    const catalogo = document.getElementById('catalogo');
    catalogo.innerHTML = '';

    juegos.forEach(juego => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';
        tarjeta.onclick = () => abrirModal(juego);

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

function abrirModal(juego) {
    let urlImagen = `https://art.gametdb.com/switch/coverfullHQ/${juego.region}/${juego.id}.jpg`;
    
    if (juego.fanart) {
        urlImagen = juego.fanart;
    }

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

document.getElementById('buscador').addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = todosLosJuegos.filter(j =>
        j.titulo.toLowerCase().includes(texto) ||
        (j.sinopsis && j.sinopsis.toLowerCase().includes(texto))
    );
    renderizarCatalogo(filtrados);
});

document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') cerrarModal();
});

document.addEventListener('DOMContentLoaded', cargarDatos);
