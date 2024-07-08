/*function cargarTarjetas() {
    fetch(URL + 'productos', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(productos => {
        const contenedor = document.getElementById('tarjetas-container');
        contenedor.innerHTML = ''; // Limpiar contenedor antes de agregar nuevos productos
        productos.forEach(producto => {
            agregarTarjeta(producto);
        });
    })
    .catch(error => console.error('Error al cargar productos:', error));
}*/
//const URL = 'http://localhost:5000/';
const URL = 'https://g4bynach0.pythonanywhere.com/';

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://g4bynach0.pythonanywhere.com/productos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    //fetch(URL + 'productos', {
        //method: 'GET'
   // })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(productos => {
        const contenedor = document.getElementById('tarjetas-container');
        contenedor.innerHTML = ''; // Limpiar contenedor antes de agregar nuevos productos
        productos.forEach(producto => {
            agregarTarjeta(producto);
            console.log('Productos cargados:', productos);
        });
    })
    .catch(error => console.error('Error al cargar productos:', error));
});

function agregarTarjeta(producto) {

    if (!producto.imagen_url) {
        console.error('Producto sin imagen:', producto); // Agregar esto para ver el producto problemático
        return;
    }

    var contenedor = document.getElementById('tarjetas-container');
    var tarjetaHTML = `
        <article class="contenedor_tarjeta">
            <div class="contenedor-imagen-tarjeta">
                <img src="https://g4bynach0.pythonanywhere.com/src/imgs/${producto.imagen_url}" alt="Imagen representativa" class="tarjeta-imagen">
            </div>
            <div class="contenedor-descripcion-tarjeta">
                <h2 class="title-tarjeta">${producto.titulo}</h2>
                <p class="decripcion-tarjeta">${producto.descripcion}</p>
                <span>$${producto.precio} <span class="cuotas-tarjetas">en stock ${producto.cantidad}</span></span>
            </div>
            <div class="contenedor-btns-tarjeta">
                <a href="" class="btn-tarjeta-comprar">Comprar</a>
                <a href="" class="btn-ver-mas">Ver Mas</a>
            </div>
        </article>
    `;
    contenedor.insertAdjacentHTML('beforeend', tarjetaHTML);
}

// Cargar las tarjetas cuando se carga la página
//document.addEventListener('DOMContentLoaded', cargarTarjetas);