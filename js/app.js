const agregarCarritoBtns = document.querySelectorAll('.agregar-carrito');
const listaCarrito = document.querySelector('#lista-carrito tbody');
const totalCarritoSpan = document.getElementById('total-carrito');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

let carrito = [];

agregarCarritoBtns.forEach(btn => {
  btn.addEventListener('click', agregarCursoAlCarrito);
});

document.addEventListener('DOMContentLoaded', () => {
  carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  actualizarCarritoHTML();
  actualizarTotalCarrito();
  
  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
});

function agregarCursoAlCarrito(e) {
  e.preventDefault();

  const cursoSeleccionado = e.target.parentElement.parentElement;
  const cursoInfo = obtenerCursoInfo(cursoSeleccionado);

  const cursoEnCarrito = carrito.find(curso => curso.id === cursoInfo.id);

  if (cursoEnCarrito) {
    cursoEnCarrito.cantidad++;
  } else {
    carrito.push({ ...cursoInfo, cantidad: 1 });
  }

  actualizarCarritoHTML();
  actualizarTotalCarrito();
}

function obtenerCursoInfo(curso) {
  const imagen = curso.querySelector('.imagen-curso').getAttribute('src');
  const nombre = curso.querySelector('.info-card h4').textContent;
  const precio = curso.querySelector('.precio span').textContent;
  const id = parseInt(curso.querySelector('.agregar-carrito').getAttribute('data-id'));
  
  return { imagen, nombre, precio, id };
}

function actualizarCarritoHTML() {
  limpiarCarritoHTML();

  carrito.forEach(curso => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${curso.imagen}" width="100"></td>
      <td>${curso.nombre}</td>
      <td>${curso.precio}</td>
      <td>${curso.cantidad}</td>
      <td><a href="#" class="borrar-curso" data-id="${curso.id}">X</a></td>
    `;

    listaCarrito.appendChild(row);
  });

  sincronizarStorage();
}

function actualizarTotalCarrito() {
  totalCarritoSpan.textContent = carrito.reduce((total, curso) => total + curso.cantidad, 0);
}

function limpiarCarritoHTML() {
  while (listaCarrito.firstChild) {
    listaCarrito.removeChild(listaCarrito.firstChild);
  }
}

function sincronizarStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('borrar-curso')) {
    const cursoId = parseInt(e.target.getAttribute('data-id'));
    carrito = carrito.filter(curso => curso.id !== cursoId);
    actualizarCarritoHTML();
    actualizarTotalCarrito();
  }
});

function vaciarCarrito() {
  carrito = [];
  actualizarCarritoHTML();
  actualizarTotalCarrito();
  sincronizarStorage();
}


