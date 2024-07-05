const URL = "https://g4bynach0.pythonanywhere.com/";

// Capturamos el evento de envio del formulario
document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    
    // Convertir formData a un objeto para enviarlo como JSON
    var formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    fetch(URL + 'productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObject)
    })
    .then(response => {
        console.log(response);
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error al agregar el producto');
        }
    })
    .then(data => {
        console.log('Success:', data);
        alert('Producto agregado correctamente');
        window.location.href = '../../index.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al agregar el producto');
    })
    .finally(() => {
        // Limpiamos el formulario
        document.getElementById('titulo').value = "";
        document.getElementById('descripcion').value = "";
        document.getElementById('cantidad').value = "";
        document.getElementById('precio').value = "";
        document.getElementById('imagenProducto').value = "";
    });
});
