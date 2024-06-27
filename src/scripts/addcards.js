const URL = "http://127.0.0.1:5000/"
// Reemplazar el siguiente USUARIO por el usuario de Pythonanywhere LE SAQUE EL URL PORQUE DABA ERROR
//const PEP = " https://USUARIO.pythonanywhere.com"  // PEPE y PEP eran URL

// Capturamos el evento de envio del formulario
document.getElementById('formulario').addEventListener('submit', function(event) {
event.preventDefault();
var formData = new FormData(this);
fetch(URL + 'productos',{
method: 'POST',
body: formData
})

// Utilizamos el método then para manejar la respuesta del servidor

.then(function(response) {
if (response.ok) {
    return response.json();
} else {
    throw new Error('Error al agregar el producto');
}
})
.then(function(data) {
alert('Producto agregado correctamente');
window.location.href = '/index.html';

})
.catch(function(error) {
alert('Error al agregar el producto');
})
// Limpiamos el formulario

.finally(function() {
document.getElementById('titulo').value = "";
document.getElementById('descripcion').value = "";
document.getElementById('cantidad').value = "";
document.getElementById('precio').value = "";
document.getElementById('imagenProducto').value = "";
})

})

function cargarTarjetas() {
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
}

function agregarTarjeta(producto) {
    var contenedor = document.getElementById('tarjetas-container');
    var tarjetaHTML = `
        <article class="contenedor_tarjeta">
            <div class="contenedor-imagen-tarjeta">
                <img src="./src/imgs/${producto.imagen}" alt="Imagen representativa">
            </div>
            <div class="contenedor-descripcion-tarjeta">
                <h2 class="title-tarjeta">${producto.titulo}</h2>
                <p class="decripcion-tarjeta">${producto.descripcion}</p>
                <span>${producto.precio} <span class="cuotas-tarjetas">en stock ${producto.cantidad}</span></span>
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
document.addEventListener('DOMContentLoaded', cargarTarjetas);