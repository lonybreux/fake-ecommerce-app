function renderizarCards(productos) {

    const productosGrid = document.getElementById('productos-grid')

    productos.forEach(p => {
        const nuevoCard = document.createElement('div')

        const imagen = p.imagen
        const categoria = p.categoria
        const nombre = p.nombre
        const rating = p.rating
        const precio = p.precio

        const imagenElement = document.createElement('img')
        imagenElement.src = 'assets/img/productos/'.concat(imagen)
        imagenElement.classList.add('producto-img')

        const infoElement = document.createElement('div')

        const categoriaElement = document.createElement('p')
        categoriaElement.textContent = categoria

        const nombreElement = document.createElement('h3')
        nombreElement.textContent = nombre

        const ratingElement = document.createElement('span')
        if(rating > 0) {
            ratingElement.innerHTML = '<i class="fa-solid fa-star"></i>'.repeat(Math.floor(rating)) + `${rating}`
            if(rating % 1 !== 0){
                ratingElement.innerHTML = '<i class="fa-solid fa-star"></i>'.repeat(Math.floor(rating)) + '<i class="fa-solid fa-star-half-stroke"></i>' + `${rating}` 
            }
            
        }
        else ratingElement.innerHTML = 'Sin reseñas'

        const precioElement = document.createElement('span')
        precioElement.textContent = `$${Math.round(precio)}`

        const precioBtnDiv = document.createElement('div')
        precioBtnDiv.classList.add('card-precio-btn')

        const botonElement = document.createElement('button')
        botonElement.textContent = 'Comprar'
        botonElement.classList.add('card-comprar-btn')

        infoElement.classList.add('card-info')
        infoElement.appendChild(categoriaElement)
        infoElement.appendChild(nombreElement)
        infoElement.appendChild(ratingElement)
        precioBtnDiv.appendChild(precioElement)
        precioBtnDiv.appendChild(botonElement)
        infoElement.appendChild(precioBtnDiv)
        
        nuevoCard.appendChild(imagenElement)
        nuevoCard.appendChild(infoElement)

        nuevoCard.classList.add('producto-card')

        productosGrid.appendChild(nuevoCard)
    });
}


async function obtenerMejoresRankeados() {
    
   try {
    
    const res = await fetch('http://localhost:3000/api/productos',{
        method: 'GET',
        headers: {'Content-Type':'application/json'}
    })

    const data = await res.json()

    if(!res.ok) throw new Error(data.message)

    const productos = data.body

    productos.sort((a,b) => b.rating - a.rating)

    const mejoresProductos = productos.slice(0,4)

    console.log(mejoresProductos)
    renderizarCards(mejoresProductos)

   }catch(error) {
        console.log(error.message)
   }
}

obtenerMejoresRankeados()

function renderizarComentarios(comentarios) {
    const comentariosGrid = document.getElementById('comentarios-grid')

    comentarios.forEach(c => {
        

        const nuevoCard = document.createElement('div')
        nuevoCard.classList.add('comentario-div')

        const nombre = c.cliente.nombre
        const apellido = c.cliente.apellido
        const contenido = c.contenido
        const fecha = c.createdAt

        const fotoPerfilDiv = document.createElement('div')
        fotoPerfilDiv.classList.add('foto-perfil-div')
        const letrasPerfil = document.createElement('p')
        letrasPerfil.textContent = nombre[0] + apellido[0]
        fotoPerfilDiv.appendChild(letrasPerfil)

        const comentarioInfoDiv = document.createElement('div')
        comentarioInfoDiv.classList.add('comentario-info-div')
        const comentarioInfoHeader = document.createElement('div')
        comentarioInfoHeader.classList.add('comentario-info-header')

        const nombreApellidoElement = document.createElement('p')
        nombreApellidoElement.textContent = `${nombre.trim()} ${apellido[0].toUpperCase()}.`
        comentarioInfoHeader.appendChild(nombreApellidoElement)

        const fechaElement = document.createElement('span')
        fechaElement.textContent = new Date(fecha).toLocaleDateString('es-PE',{
            year:'numeric',
            month:'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        comentarioInfoHeader.appendChild(fechaElement)

        comentarioInfoDiv.appendChild(comentarioInfoHeader)

        const contenidoElement = document.createElement('p')
        contenidoElement.textContent = contenido

        comentarioInfoDiv.appendChild(contenidoElement)

        nuevoCard.appendChild(fotoPerfilDiv)
        nuevoCard.appendChild(comentarioInfoDiv)

        comentariosGrid.appendChild(nuevoCard)
    })
}

async function obtenerComentarios() {
    try {
        const res = await fetch('http://localhost:3000/api/comentarios',{
            method: 'GET',
            headers: {'Content-Type':'application/json'}
        })

        const data = await res.json()

        if(!res.ok) throw new Error(data.message)
        
        const comentarios = data.body
        
        renderizarComentarios(comentarios)

    } catch(error) {
        console.log(error.message)
    }
}

obtenerComentarios()

const caterogiasBtn = document.getElementById('categorias-btn')
caterogiasBtn.addEventListener('click', e => {
    e.preventDefault()

    const dropDown = document.querySelector('.dropdown')

    if(dropDown.classList.contains('dropdown-active')) dropDown.classList.remove('dropdown-active')
    else dropDown.classList.add('dropdown-active')

    
})

const busquedaInput = document.getElementById('buscador-input')

let timeout

busquedaInput.addEventListener('input', (e) => {

    clearTimeout(timeout)

    timeout = setTimeout(() => {
        const termino = e.target.value.trim()

        if(termino.length > 0) window.location.href = `../../pages/productos.html?busqueda=${termino}`
    }, 500)
})
