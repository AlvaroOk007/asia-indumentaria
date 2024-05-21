const btnParaMostrar = document.getElementById("btn-desplegar")
let contenidoMostrar = document.getElementById("nav-a-mostrar")
let estaMostrando = false
btnParaMostrar.addEventListener("click",()=>{
    if (estaMostrando){
        contenidoMostrar.classList.remove("mostrar")
        estaMostrando = false
        btnParaMostrar.innerText = "expand_more"
    }else{
        contenidoMostrar.classList.add("mostrar")
        estaMostrando = true
        btnParaMostrar.innerText = "keyboard_control_key"
    }
})

const btnMostrarMenuPrincipal = document.getElementById("menu-hamburguesa")
let menuPrincipal = document.getElementById("navegador-principal")
let estaMostrandoMenuPrincipal = false
btnMostrarMenuPrincipal.addEventListener("click",()=>{
    if(estaMostrandoMenuPrincipal){
        menuPrincipal.classList.remove("posicionar-menu")
        menuPrincipal.classList.add("ocultar-menu")
        estaMostrandoMenuPrincipal = false
        btnMostrarMenuPrincipal.innerText = "menu"
    }else{
        menuPrincipal.classList.add("posicionar-menu")
        menuPrincipal.classList.remove("ocultar-menu")
        estaMostrandoMenuPrincipal = true
        btnMostrarMenuPrincipal.innerText = "close"
    }
})
let menuBusqueda = document.getElementById("contenedor-busqueda")
let btnBuscar = document.getElementById("btn-search")
let btnCerrar = document.getElementById("btn-cerrar-search")
let mostrandoMenuBusqueda = false
btnBuscar.addEventListener("click",()=>{
    if(!mostrandoMenuBusqueda){
        menuBusqueda.classList.add("posicionar-menu")
        menuBusqueda.classList.remove("ocultar-menu")
        mostrandoMenuBusqueda = false
    }
})
btnCerrar.addEventListener("click",()=>{
    
    menuBusqueda.classList.remove("posicionar-menu")
    menuBusqueda.classList.add("ocultar-menu")
    mostrandoMenuBusqueda = false
})

/* Validación de Campos del formulario */

/* REGEX usadas */

const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');


const expresiones = {
	usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, 
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, 
	password: /^.{4,12}$/, 
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	telefono: /^\d{7,14}$/
}

const campos = {
	usuario: false,
	nombre: false,
	password: false,
	correo: false,
	telefono: false
}

const validarFormulario = (e) => {
	switch (e.target.name) {
		case "usuario":
			validarCampo(expresiones.usuario, e.target, 'usuario');
		break;
		case "nombre":
			validarCampo(expresiones.nombre, e.target, 'nombre');
		break;
		case "password":
			validarCampo(expresiones.password, e.target, 'password');
			validarPassword2();
		break;
		case "password2":
			validarPassword2();
		break;
		case "correo":
			validarCampo(expresiones.correo, e.target, 'correo');
		break;
		case "telefono":
			validarCampo(expresiones.telefono, e.target, 'telefono');
		break;
	}
}

const validarCampo = (expresion, input, campo) => {
	if(expresion.test(input.value)){
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
		campos[campo] = true;
	} else {
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
		campos[campo] = false;
	}
}

const validarPassword2 = () => {
	const inputPassword1 = document.getElementById('password');
	const inputPassword2 = document.getElementById('password2');

	if(inputPassword1.value !== inputPassword2.value){
		document.getElementById(`grupo__password2`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__password2`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__password2 i`).classList.add('fa-times-circle');
		document.querySelector(`#grupo__password2 i`).classList.remove('fa-check-circle');
		document.querySelector(`#grupo__password2 .formulario__input-error`).classList.add('formulario__input-error-activo');
		campos['password'] = false;
	} else {
		document.getElementById(`grupo__password2`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__password2`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#grupo__password2 i`).classList.remove('fa-times-circle');
		document.querySelector(`#grupo__password2 i`).classList.add('fa-check-circle');
		document.querySelector(`#grupo__password2 .formulario__input-error`).classList.remove('formulario__input-error-activo');
		campos['password'] = true;
	}
}

inputs.forEach((input) => {
	input.addEventListener('keyup', validarFormulario);
	input.addEventListener('blur', validarFormulario);
});

formulario.addEventListener('submit', (e) => {
	e.preventDefault();

	const terminos = document.getElementById('terminos');
	if(campos.usuario && campos.nombre && campos.password && campos.correo && campos.telefono && terminos.checked ){
		formulario.reset();

		document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
        document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-activo');
		setTimeout(() => {
			document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
		}, 5000);

		document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
			icono.classList.remove('formulario__grupo-correcto');
		});
	} else {
		document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');
		document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
		}, 5000);
	}
});