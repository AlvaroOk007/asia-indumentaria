const btnParaMostrar = document.getElementById("btn-desplegar")
let contenidoMostrar = document.getElementById("nav-a-mostrar")
// btnParaMostrar.addEventListener("click",()=>{
//     contenidoMostrar.classList.toggle("mostrar")
// })

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
        estaMostrandoMenuPrincipal = false
        btnMostrarMenuPrincipal.innerText = "menu"
        btnMostrarMenuPrincipal.classList.remove("posicionar-menu-hamburguesa")

    }else{
        menuPrincipal.classList.add("posicionar-menu")
        estaMostrandoMenuPrincipal = true
        btnMostrarMenuPrincipal.innerText = "close"
        btnMostrarMenuPrincipal.classList.add("posicionar-menu-hamburguesa")
    }
})