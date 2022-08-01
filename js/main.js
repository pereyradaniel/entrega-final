import {contenedorCarrito, contadorCarrito, precioTotal, DOMProductos, DOMvaciarCarrito, btnEnviar} from  './variables.js'


let carrito = [];


window.addEventListener('DOMContentLoaded', () => {
    renderizarDOM();
});

DOMvaciarCarrito.addEventListener('click', vaciarCarrito);


/********** funcion que trae datos del json ***********/

 const traerDatos = async() => {
    let respuesta = await fetch('./stock.json')
    return respuesta.json()
  }


/********** invoco la función que me trae los datos del json ***********/

  const renderizarDOM = async() => {
  recorrerStorage()
  let productos = await traerDatos()
  let renderProductos = ''
  productos.forEach(product => {
  const {id, producto, marca, precio, img} = product
{
  renderProductos += `<div class="card" style="width: 18rem;">
  <img src="${img}" class="card-img-top" alt="...">
  <div class="card-body">
      <h5 class="card-title">${producto}</h5>
      <h6>Precio $${precio}</h6>
      <p class="card-text">${marca}</p>
      <buttom data-id="${id}" id="myBtn"class="btn btn-light btn-estilo"><i class="fa-solid fa-cart-arrow-down"></i> Agregar al Carrito</buttom>
  </div>
</div> `;
}
  });
  DOMProductos.innerHTML = renderProductos
}

DOMProductos.addEventListener('click',  (e)=>{
    if(e.target.id ==="myBtn"){

      guardarProductos(e.target.dataset.id)
    }
})

/********** guardar productos en el storage ***********/

const guardarProductos = async (id)=> {
    let productos = await traerDatos()
    let productosEncontrados = productos.find(producto => producto.id === parseInt(id))

      // productosEncontrados.cantidad = productosEncontrados.cantidad -1

    Toastify({
      text: "Se agregó el producto",
      duration: 1500,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background:
          "linear-gradient(0deg, rgba(69,163,21,1) 0%, rgba(84,253,45,1) 100%)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
    let productosStorage = JSON.parse(localStorage.getItem(id))

 if(productosStorage === null){
        localStorage.setItem(id, JSON.stringify({...productosEncontrados, cantidad:1, subTotal:productosEncontrados.precio}))

        recorrerStorage();

    }else{
        let productoExiste = JSON.parse(localStorage.getItem(id))
        productoExiste.cantidad = productoExiste.cantidad +1
        productoExiste.subTotal = productoExiste.subTotal + productoExiste.precio
        localStorage.setItem(id, JSON.stringify(productoExiste))
        recorrerStorage(productoExiste);
     }
}

const recorrerStorage = () => {
    carrito.length = 0;

    for(let index=0; index < localStorage.length; index++){
        const element = localStorage.key(index)
        carrito.push(JSON.parse(localStorage.getItem(element)))

    }
renderCarrito();
}

/********** renderizar productos en el carrito ***********/


const renderCarrito = () => {

if(carrito.length > 0){
  contenedorCarrito.innerHTML = " "
  actualizarCarrito()

    carrito.forEach (productoAgregar => {
        let { img, producto, marca, precio, cantidad, subTotal, id } = productoAgregar;
  let div = document.createElement("div");
  div.classList.add("productoEnCarrito");
  div.innerHTML = `<img src="${img}" width=50>
                <p>${producto}</p>
                <p>${marca}</p>
                <p>Precio: $${precio}</p>
                <p>Subtotal: $${subTotal}</p>
                <p id="cantidad${id}">cantidad: ${cantidad}</p>
                <button id="eliminar${id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>`;

  contenedorCarrito.appendChild(div);

let btnEliminar = document.getElementById(`eliminar${id}`);
btnEliminar.addEventListener("click", () => {
if (productoAgregar.cantidad == 1) {

 Toastify({
   text: "Se eliminó el producto",
   duration: 1500,
   newWindow: true,
   close: true,
   gravity: "top", // `top` or `bottom`
   position: "right", // `left`, `center` or `right`
   stopOnFocus: true, // Prevents dismissing of toast on hover
   style: {
     background:
       "linear-gradient(90deg, rgba(157,4,4,1) 44%, rgba(255,63,63,1) 81%, rgba(255,0,0,1) 100%)",
   },
   onClick: function () {}, // Callback after click
 }).showToast();

 localStorage.removeItem(id)

 btnEliminar.parentElement.remove();

 carrito = carrito.filter(
   (item) => item.id !== productoAgregar.id

 );

 actualizarCarrito()

    } else {
      productoAgregar.cantidad = productoAgregar.cantidad - 1;
      Toastify({
        text: "Se eliminó una unidad del producto",
        duration: 1500,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background:
            "linear-gradient(90deg, rgba(157,4,4,1) 44%, rgba(255,63,63,1) 81%, rgba(255,0,0,1) 100%)",
        },
        onClick: function () {}, // Callback after click
      }).showToast();

      editarStorage(id);

      document.getElementById(
        `cantidad${productoAgregar.id}`
      ).innerHTML = `<p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>`;
      actualizarCarrito()

    }

  });

    })
}}

/*************************funcion editar carrito*******************/


const editarStorage= async(id) => {
  let productosStorage = JSON.parse(localStorage.getItem(id))
  productosStorage.cantidad = productosStorage.cantidad-1
  productosStorage.subTotal = productosStorage.subTotal - productosStorage.precio
  localStorage.setItem(id, JSON.stringify(productosStorage));
  recorrerStorage()
  renderCarrito()
}

/*************************funcion vaciar carrito*******************/


function vaciarCarrito() {

// Limpiamos los productos guardados
      localStorage.clear(); 
      contenedorCarrito.innerHTML = " "

// recorrer storage
      recorrerStorage();

// Renderizamos los cambios
      actualizarCarrito();

}


// // funcion que suma la cantidad de elementos del carrito

function actualizarCarrito() {

  contadorCarrito.innerText = carrito.reduce(
    (acc, el) => acc + el.cantidad,
    0
  );
  precioTotal.innerText = carrito.reduce(
    (acc, el) => acc + el.precio * el.cantidad,
    0 
  );
 }

/*************************funcion Enviar*******************/

btnEnviar.addEventListener("click", (e)=>  {
  e.preventDefault();
    if(localStorage.length != 0){
      vaciarCarrito()
      setTimeout(function(){
        window.location.href ="/index.html"
    }, 2650);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Pedido enviado',
        text: 'Gracias por su compra!',
        showConfirmButton: false,
        timer: 2500

      })    }else{
        setTimeout(function(){
          window.location.href ="/index.html"
      }, 2600);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Carrito Vacio',
          showConfirmButton: false,
          timer: 1500
        })

}

})

