// Inicializar Lenis (Smooth Scroll)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const productos = [
  // Cemento
  { id: 1,  nombre: "Cemento Avellaneda x 25kg",           img: "img/Cemento Avellaneda x 25kg.jpg" },
  // Cal
  { id: 2,  nombre: "Cal Avellaneda x 25kg",               img: "img/Cal Avellaneda x 25kg.webp" },
  // Arena
  { id: 3,  nombre: "Arena Fina x Tonelada",               img: "img/Arena Fina x Tonelada.jpg" },
  // Piedras
  { id: 4,  nombre: "Piedra Especial 6/20 x Tonelada",     img: "img/Piedra Especial 6 20 x Tonelada.jpg" },
  { id: 5,  nombre: "Piedra Partida Rosa x Tn",             img: "img/Piedra Partida Rosa x Tn.webp" },
  { id: 6,  nombre: "Piedra 10/30",                         img: "img/Piedra 10 30.jpg" },
  { id: 7,  nombre: "Estabilizado Granular x Tonelada",    img: "img/Estabilizado Granular x Tonelada.jpg" },
  // Hierros
  { id: 8,  nombre: "Hierro 4.2mm \u2013 Barra 12mts",     img: "img/Hierro 4.2mm \u2013 Barra 12mts.webp" },
  { id: 9,  nombre: "Hierro 6mm \u2013 Barra 12mts",       img: "img/Hierro 6mm \u2013 Barra 12mts.webp" },
  { id: 10, nombre: "Hierro 8mm \u2013 Barra 12mts",       img: "img/Hierro 8mm \u2013 Barra 12mts.webp" },
  { id: 11, nombre: "Hierro 10mm \u2013 Barra 12mts",      img: "img/Hierro 10mm \u2013 Barra 12mts.webp" },
  { id: 12, nombre: "Hierro 12mm \u2013 Barra 12mts",      img: "img/Hierro 12mm \u2013 Barra 12mts.webp" },
  // Malla
  { id: 13, nombre: "Malla QL100 \u2013 150x150cm 3x2m 4mm", img: "img/Malla QL100 \u2013 150x150cm 3x2m 4mm.avif" },
  // Ladrillos
  { id: 14, nombre: "Ladrillo Com\u00fan",                  img: "img/Ladrillo Com\u00fan.webp" },
  { id: 15, nombre: "Ladrillo Com\u00fan Media Vista",      img: "img/Ladrillo Com\u00fan Media Vista.jpg" },
  { id: 16, nombre: "Ladrillo Ctibor 8x18x32 \u2013 6 Tubos",  img: "img/Ladrillo Ctibor 8x18x32 \u2013 6 Tubos.webp" },
  { id: 17, nombre: "Ladrillo Ctibor 12x18x33 \u2013 9 Tubos", img: "img/Ladrillo Ctibor 12x18x33 \u2013 9 Tubos.webp" },
  { id: 18, nombre: "Ladrillo Ctibor 18x18x33 \u2013 12 Tubos",img: "img/Ladrillo Ctibor 18x18x33 \u2013 12 Tubos.webp" },
  // Sinteplast
  { id: 19, nombre: "Sinteplast Hidr\u00f3fugo x 1kg",     img: "img/Sinteplast Hidr\u00f3fugo x 1kg.webp" },
  { id: 20, nombre: "Sinteplast Hidr\u00f3fugo x 5kg",     img: "img/Sinteplast Hidr\u00f3fugo x 5kg.png" },
  { id: 21, nombre: "Sinteplast Hidr\u00f3fugo x 10kg",    img: "img/Sinteplast Hidr\u00f3fugo x 10kg.jpg" },
  { id: 22, nombre: "Sinteplast Hidr\u00f3fugo x 20kg",    img: "img/Sinteplast Hidr\u00f3fugo x 20kg.webp" },
];

let presupuesto = JSON.parse(localStorage.getItem("presupuesto")) || [];

const lista = document.getElementById("listaPresupuesto");
const contador = document.getElementById("contador");

function renderProductos() {
  const container = document.getElementById("productosContainer") || document.getElementById("sliderProductos");
  if (!container) return;

  const isSlider = container.id === "sliderProductos";
  const productosToRender = isSlider ? productos.slice(0, 6) : productos;

  productosToRender.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("reveal"); // Para que los productos también se animen
    if (isSlider) {
      card.classList.add("slider-card");
    }

    card.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <div class="qty-selector">
        <div class="qty-btn" onclick="modificarCantidad(${p.id}, -1)">-</div>
        <input type="number" min="1" value="1" id="cant-${p.id}" readonly>
        <div class="qty-btn" onclick="modificarCantidad(${p.id}, 1)">+</div>
      </div>
      <button onclick="agregar(${p.id}, this)">Agregar</button>
    `;

    container.appendChild(card);
  });
}

function modificarCantidad(id, delta) {
  const input = document.getElementById(`cant-${id}`);
  let valor = parseInt(input.value) + delta;
  if (valor < 1) valor = 1;
  input.value = valor;
}

function agregar(id, btn) {
  const cantidad = document.getElementById(`cant-${id}`).value;
  const producto = productos.find(p => p.id === id);

  const existente = presupuesto.find(p => p.id === id);

  if (existente) {
    existente.cantidad += parseInt(cantidad);
  } else {
    presupuesto.push({ ...producto, cantidad: parseInt(cantidad) });
  }

  guardar();
  renderPresupuesto();

  if (btn) {
    btn.classList.add('btn-success-anim');
    btn.innerHTML = "¡Agregado!";
    setTimeout(() => {
      btn.classList.remove('btn-success-anim');
      btn.innerHTML = "Agregar";
    }, 600);
  }

  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.classList.remove('cart-bounce');
    void cartBtn.offsetWidth; 
    cartBtn.classList.add('cart-bounce');
  }
}

function renderPresupuesto() {
  lista.innerHTML = "";
  
  let totalItems = 0;

  presupuesto.forEach(p => {
    totalItems += p.cantidad;
    const div = document.createElement("div");
    div.classList.add("presupuesto-item");
    div.innerHTML = `
      <span>${p.cantidad}x ${p.nombre}</span>
      <button onclick="eliminar(${p.id})">❌</button>
    `;
    lista.appendChild(div);
  });

  contador.textContent = `Productos distintos: ${presupuesto.length}`;
  
  const cartCount = document.getElementById("cartCount");
  if(cartCount) cartCount.textContent = totalItems;
}

function eliminar(id) {
  presupuesto = presupuesto.filter(p => p.id !== id);
  guardar();
  renderPresupuesto();
}

function guardar() {
  localStorage.setItem("presupuesto", JSON.stringify(presupuesto));
}

document.getElementById("limpiar").addEventListener("click", () => {
  presupuesto = [];
  guardar();
  renderPresupuesto();
});

document.getElementById("enviar").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!nombre || !telefono) {
    alert("Completa nombre y teléfono");
    return;
  }

  if (presupuesto.length === 0) {
    alert("Agrega al menos un producto");
    return;
  }

  let mensaje = `Hola, quiero solicitar un presupuesto:\n\n`;
  mensaje += `Nombre: ${nombre}\n`;
  mensaje += `Teléfono: ${telefono}\n`;
  if (email) mensaje += `Email: ${email}\n`;

  mensaje += `\nProductos:\n`;

  presupuesto.forEach(p => {
    mensaje += `- ${p.nombre}: ${p.cantidad} unidades\n`;
  });

  mensaje += `\nGracias.`;

  const url = `https://wa.me/2345563423?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
});

// Scroll suave
document.querySelectorAll("a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

renderProductos();

// Intersection Observer para efectos de Scroll Reveal
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

// Función para observar elementos (incluyendo los generados dinámicamente)
function aplicarReveal() {
  const targets = document.querySelectorAll('.reveal');
  targets.forEach(target => observer.observe(target));
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
  aplicarReveal();
});

// También ejecutar después de renderizar productos
setTimeout(aplicarReveal, 100);

renderPresupuesto();

// Modal Logic
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeBtn = document.querySelector('.close-btn');

if (cartBtn && cartModal && closeBtn) {
  cartBtn.addEventListener('click', () => {
    cartModal.classList.add('show');
  });

  closeBtn.addEventListener('click', () => {
    cartModal.classList.remove('show');
  });

  window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove('show');
    }
  });
}

// Estado abierto / cerrado del local
function actualizarEstadoLocal() {
  const ahora = new Date();
  const dia = ahora.getDay();
  const minutos = ahora.getHours() * 60 + ahora.getMinutes();

  const apertura     = 7 * 60;
  const cierreSemana = 16 * 60;
  const cierreSabado = 12 * 60;

  let abierto = false;
  if (dia >= 1 && dia <= 5) {
    abierto = minutos >= apertura && minutos < cierreSemana;
  } else if (dia === 6) {
    abierto = minutos >= apertura && minutos < cierreSabado;
  }

  document.querySelectorAll('.estado-local').forEach(el => {
    el.textContent = abierto ? '● Abierto' : '● Cerrado';
    el.className   = 'estado-local ' + (abierto ? 'abierto' : 'cerrado');
  });

  const badge = document.getElementById('horarioEstado');
  if (badge) {
    badge.textContent = abierto ? '● Abierto ahora' : '● Cerrado ahora';
    badge.className   = 'horario-estado-badge ' + (abierto ? 'abierto' : 'cerrado');
  }
}

actualizarEstadoLocal();
setInterval(actualizarEstadoLocal, 60000);

// Modal horarios
const horariosModal = document.getElementById('horariosModal');
const horariosClose = document.querySelector('.horarios-modal-close');

document.querySelectorAll('.estado-local').forEach(btn => {
  btn.addEventListener('click', () => horariosModal && horariosModal.classList.add('show'));
});

if (horariosClose) {
  horariosClose.addEventListener('click', () => horariosModal.classList.remove('show'));
}
if (horariosModal) {
  horariosModal.addEventListener('click', e => {
    if (e.target === horariosModal) horariosModal.classList.remove('show');
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && horariosModal) horariosModal.classList.remove('show');
});
