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




