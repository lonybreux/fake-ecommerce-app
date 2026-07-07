async function getTokenStatus() {

    const token = localStorage.getItem('token')

    if(!token) {
        window.location.href = '/frontend/landing.html'
        return
    }

    const res = await fetch('http://localhost:3000/api/auth/status', {
        method: 'GET',
        headers: {'authorization': `Bearer ${token}`}
    })


    if(res.status === 403) {
        console.log('403 detectado redirigiendo')
        localStorage.removeItem('token')
        window.location.href = '../../landing.html'
        return
    }
}

console.log('token', localStorage.getItem('token'))
getTokenStatus().then()

function renderizarProductos(productos) {

    const carritoGrid = document.getElementById('carrito-grid')

    productos.forEach(p => {

        const nuevoArticle = document.createElement('article')
        nuevoArticle.classList.add('nuevo-articulo')
        
        const imagen = p.productoId.imagen
        
        const imagenElement = document.createElement('img')
        imagenElement.src = `/frontend/assets/img/productos/${imagen}`
        const imagenDiv = document.createElement('div')
        imagenDiv.classList.add('imagen-div')
        imagenDiv.appendChild(imagenElement)

        const infoDiv = document.createElement('div')
        infoDiv.classList.add('info-div')
        const infoheader = document.createElement('div')
        infoheader.classList.add('info-header')
        const infoText = document.createElement('p')
        const marca = p.productoId.marca.nombre
        const categoria = p.productoId.categoria
        infoText.textContent = `${marca} . ${categoria}`
        infoheader.appendChild(infoText)
        infoDiv.appendChild(infoheader)

        const nombre = p.productoId.nombre
        const nombreElement = document.createElement('h3')
        nombreElement.textContent = `${nombre}`
        infoDiv.appendChild(nombreElement)

        const numerosDiv = document.createElement('div')
        numerosDiv.classList.add('numeros-div')
        const masmenosDiv = document.createElement('div')
        masmenosDiv.classList.add('mas-menos-div')
        const menosBtn = document.createElement('button')
        menosBtn.id = 'menos-btn'

        menosBtn.addEventListener('click',e => {
            const cantidadSpan = document.getElementById('cantidad-span')
    
            const cantidad = Number(cantidadSpan.textContent)

            if(cantidad > 1) cantidadSpan.textContent = cantidad - 1
        })

        menosBtn.innerHTML = '<i class="fa-solid fa-minus"></i>'
        const cantidadSpan = document.createElement('span')
        cantidadSpan.classList.add('cantidad-span')
        cantidadSpan.textContent = p.cantidad
        const masBtn = document.createElement('button')
        masBtn.id = 'mas-btn'

        masBtn.addEventListener('click',e => {
            const span = e.target.closest('.mas-menos-div').querySelector('.cantidad-span')
            
            const cantidad = Number(span.textContent)

            span.textContent = cantidad + 1
            agregarUnidadCarrito(p.productoId._id)
        })

        masBtn.innerHTML = '<i class="fa-solid fa-plus"></i>'

        masmenosDiv.appendChild(menosBtn)
        masmenosDiv.appendChild(cantidadSpan)
        masmenosDiv.appendChild(masBtn)

        numerosDiv.appendChild(masmenosDiv)

        const precioEliminarDiv = document.createElement('div')
        precioEliminarDiv.classList.add('precio-eliminar-div')
        const precio = Math.round(p.productoId.precio)
        const precioElement = document.createElement('p')
        precioElement.textContent = `S/${precio}`
        precioEliminarDiv.appendChild(precioElement)
        

        const limpiarBtn = document.createElement('button')
        limpiarBtn.innerHTML = '<i class="fa-solid fa-trash"></i>'
        precioEliminarDiv.appendChild(limpiarBtn)

        numerosDiv.appendChild(precioEliminarDiv)

        infoDiv.appendChild(numerosDiv)

        nuevoArticle.appendChild(imagenDiv)
        nuevoArticle.appendChild(infoDiv)
        
        carritoGrid.appendChild(nuevoArticle)
            
    })
}

let montoTotal = 0
async function getCarrito() {
    
    try{
        

        const token = window.localStorage.getItem('token')

        const res = await fetch('http://localhost:3000/api/carrito',{
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'authorization':`Bearer ${token}`
            }
        })

        const data = await res.json()

        if(!res.ok) throw new Error(data.message)

        const cantidadProductos = document.getElementById('cantidad-productos')
        
        if(data.body.productos.length > 1) cantidadProductos.textContent = `${data.body.productos.length} productos en el carrito`
        else cantidadProductos.textContent = `${data.body.productos.length} producto en el carrito`

        renderizarProductos(data.body.productos)

        data.body.productos.forEach(p => {
            montoTotal += Math.round(p.productoId.precio * p.cantidad)
        })

        const montoSpan = document.getElementById('monto-span')
        montoSpan.textContent = `S/${montoTotal.toLocaleString('en-US')}`
        const totalSpan = document.getElementById('monto-total-span')
        totalSpan.textContent = `S/${montoTotal.toLocaleString('en-US')}`
        
        console.log(data.body.productos)
    } catch(error) {
        console.log(error.message)
    }
    
}


getCarrito()

const cerrarSesionBtn = document.getElementById('cerrar-sesion-btn')
cerrarSesionBtn.addEventListener('click', (e) => {

    localStorage.removeItem('token')

})

async function agregarUnidadCarrito(productoId) {
    
    try {
        const token = window.localStorage.getItem('token')

        const res = await fetch('http://localhost:3000/api/carrito',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productoId,
                cantidad: 1
            })
        })

    } catch(error) {
        console.log(error.message)
    }
}