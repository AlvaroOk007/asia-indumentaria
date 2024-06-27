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
alert('Redireccionando a index.html');
window.location.href = '../../index.html';

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