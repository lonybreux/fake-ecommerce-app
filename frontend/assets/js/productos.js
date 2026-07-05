const API_URL = 'http://localhost:3000/api'

// Guarda TODOS los productos tal y como vienen de la API, sin filtrar.
// Es la "fuente de verdad": los filtros nunca la modifican, solo la leen.
let productosOriginales = []

// Qué opción de orden está elegida en el <select> ("relevancia", "precio-asc", etc.)
let ordenActual = 'relevancia'

// Representa qué filtros están activos ahora mismo en la pantalla.
// Se actualiza cada vez que el usuario toca un checkbox, el slider, etc.
const filtros = {
    categorias: new Set(),
    marcas: new Set(),
    precioMax: Infinity,
    ratingMin: 0,
    soloStock: false,
    busqueda: ''
}


const categoriasFiltrosDiv = document.getElementById('categoria-filtros')
const marcasFiltrosDiv = document.getElementById('marca-filtros')
const precioSlider = document.getElementById('precio-slider')
const precioLabel = document.getElementById('precio-label')
const ratingPills = document.querySelectorAll('.rating-pill')
const stockCheckbox = document.getElementById('stock-checkbox')
const ordenSelect = document.getElementById('orden-select')
const buscadorInput = document.getElementById('buscador-input')

const productosGrid = document.getElementById('productos-grid')
const productosVacio = document.getElementById('productos-vacio')
const productosCount = document.getElementById('productos-count')
const toastContainer = document.getElementById('toast-container')


// Le pregunta al backend si el token guardado en localStorage sigue siendo válido.
// Si el backend responde 403 (prohibido), borra el token guardado.
// Se ejecuta una sola vez, apenas carga la página.
async function getTokenStatus() {
    const token = localStorage.getItem('token')

    if (!token) return

    const res = await fetch(`${API_URL}/auth/status`, {
        method: 'GET',
        headers: { 'authorization': `Bearer ${token}` }
    })

    if (res.status === 403) {
        localStorage.removeItem('token')
    }
}

getTokenStatus()


// Crea un mensaje flotante (toast) abajo a la derecha, verde si es éxito
// o rojo si es error, y lo hace desaparecer solo después de 2.5 segundos.
function mostrarToast(mensaje, tipo = 'exito') {
    const toast = document.createElement('div')
    toast.classList.add('toast', tipo === 'error' ? 'toast-error' : 'toast-exito')
    toast.textContent = mensaje

    toastContainer.appendChild(toast)

    setTimeout(() => toast.remove(), 2500)
}


// Genera checkboxes dinámicamente dentro de "container" (uno por cada valor).
// Se reutiliza tanto para "Categoría" como para "Marca".
// Cuando el usuario tilda/destilda uno, actualiza el Set "seleccionados"
// y vuelve a pintar la lista de productos.
function renderCheckboxGroup(container, valores, seleccionados) {
    container.innerHTML = ''

    valores.forEach(valor => {
        const id = `filtro-${container.id}-${valor.replace(/\s+/g, '-')}`

        const label = document.createElement('label')
        label.classList.add('filtro-checkbox-label')
        label.setAttribute('for', id)

        const input = document.createElement('input')
        input.type = 'checkbox'
        input.id = id
        input.value = valor
        input.checked = seleccionados.has(valor)
        input.addEventListener('change', () => {
            if (input.checked) seleccionados.add(valor)
            else seleccionados.delete(valor)
            renderizarTodo()
        })

        label.appendChild(input)
        label.appendChild(document.createTextNode(valor))
        container.appendChild(label)
    })
}


// Actualiza el textito "S/0 - S/X" que se ve arriba del slider de precio.
function actualizarPrecioLabel() {
    precioLabel.textContent = `S/0 - S/${precioSlider.value}`
}


// Arma los filtros de "Categoría", "Marca" y "Precio" a partir de los
// productos reales que llegaron de la API (no están hardcodeados).
// Se llama una sola vez, apenas se cargan los productos.
function inicializarFiltros() {
    const categorias = [...new Set(productosOriginales.map(p => p.categoria))].sort()
    const marcas = [...new Set(productosOriginales.map(p => p.marca.nombre))].sort()

    renderCheckboxGroup(categoriasFiltrosDiv, categorias, filtros.categorias)
    renderCheckboxGroup(marcasFiltrosDiv, marcas, filtros.marcas)

    const maxPrecio = Math.ceil(Math.max(...productosOriginales.map(p => p.precio), 0))

    precioSlider.min = 0
    precioSlider.max = maxPrecio
    precioSlider.value = maxPrecio
    filtros.precioMax = maxPrecio

    actualizarPrecioLabel()
}


// Lee la URL (ej: productos.html?busqueda=cafetera o ?categoria=Cocina) y pre-aplica esos filtros. Sirve para cuando vienes del buscador o del menú "Categorias" del landing.html.
function aplicarFiltrosDesdeQuery() {
    const params = new URLSearchParams(window.location.search)
    const busqueda = params.get('busqueda')
    const categoria = params.get('categoria')

    if (busqueda) {
        filtros.busqueda = busqueda.trim().toLowerCase()
        buscadorInput.value = busqueda
    }

    if (categoria) {
        filtros.categorias.add(categoria)
        const checkbox = document.getElementById(`filtro-categoria-filtros-${categoria.replace(/\s+/g, '-')}`)
        if (checkbox) checkbox.checked = true
    }
}


// El filtro de verdad: recorre productosOriginales y devuelve solo los que cumplen TODAS las condiciones activas en "filtros".
// No modifica nada, siempre devuelve una lista nueva.
function filtrarProductos() {
    return productosOriginales.filter(p => {
        if (filtros.categorias.size > 0 && !filtros.categorias.has(p.categoria)) return false
        if (filtros.marcas.size > 0 && !filtros.marcas.has(p.marca.nombre)) return false
        if (p.precio > filtros.precioMax) return false
        if (p.rating < filtros.ratingMin) return false
        if (filtros.soloStock && p.estado !== 'disponible') return false
        if (filtros.busqueda && !p.nombre.toLowerCase().includes(filtros.busqueda)) return false

        return true
    })
}


// Ordena una copia de la lista (no toca la original) según "ordenActual":
// precio ascendente, descendente, o mejor valorados primero.
function ordenarProductos(lista) {
    const copia = [...lista]

    switch (ordenActual) {
        case 'precio-asc':
            copia.sort((a, b) => a.precio - b.precio)
            break
        case 'precio-desc':
            copia.sort((a, b) => b.precio - a.precio)
            break
        case 'rating-desc':
            copia.sort((a, b) => b.rating - a.rating)
            break
    }

    return copia
}


// Arma el HTML de las estrellitas + cantidad de reseñas de un producto.
// Si no tiene reviews todavía, muestra "Sin reseñas" en vez de estrellas.
function crearEstrellas(producto) {
    const span = document.createElement('span')
    span.classList.add('card-rating')

    if (producto.rating > 0) {
        let html = '<i class="fa-solid fa-star"></i>'.repeat(Math.floor(producto.rating))
        if (producto.rating % 1 !== 0) html += '<i class="fa-solid fa-star-half-stroke"></i>'

        span.innerHTML = html
        span.appendChild(document.createTextNode(` ${producto.rating}`))

        const reviewsSpan = document.createElement('span')
        reviewsSpan.classList.add('card-reviews-count')
        reviewsSpan.textContent = `(${producto.totalReviews})`
        span.appendChild(reviewsSpan)
    } else {
        span.textContent = 'Sin reseñas'
    }

    return span
}


// Crea el bloque de imagen de una tarjeta. Si la imagen no existe todavía (el usuario dijo que faltan varias), el evento "error" la reemplaza por un ícono genérico en vez de mostrar el ícono roto del navegador.
function crearImagenProducto(producto) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('card-img-wrapper')

    const img = document.createElement('img')
    img.src = `../assets/img/productos/${producto.imagen}`
    img.alt = producto.nombre
    img.classList.add('card-img')

    img.addEventListener('error', () => {
        img.remove()
        wrapper.classList.add('card-img-fallback')
        wrapper.innerHTML = '<i class="fa-solid fa-image"></i>'
    })

    wrapper.appendChild(img)
    return wrapper
}


// Arma la tarjeta completa de un producto: badge de "Sin stock" (si aplica), imagen, marca/categoría, nombre, estrellas, precio y botón "Añadir"
// (deshabilitado si no hay stock).
function crearCardProducto(producto) {
    const card = document.createElement('div')
    card.classList.add('producto-card')

    if (producto.estado !== 'disponible') {
        const badge = document.createElement('span')
        badge.classList.add('badge-sin-stock')
        badge.textContent = 'Sin stock'
        card.appendChild(badge)
    }

    card.appendChild(crearImagenProducto(producto))

    const infoDiv = document.createElement('div')
    infoDiv.classList.add('card-info')

    const marcaCategoria = document.createElement('p')
    marcaCategoria.textContent = `${producto.marca.nombre} · ${producto.categoria}`

    const nombre = document.createElement('h3')
    nombre.textContent = producto.nombre

    const precioBtnDiv = document.createElement('div')
    precioBtnDiv.classList.add('card-precio-btn')

    const precio = document.createElement('span')
    precio.classList.add('card-precio')
    precio.textContent = `S/${Math.round(producto.precio)}`

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.classList.add('card-add-btn')
    btn.textContent = 'Añadir'

    if (producto.estado !== 'disponible') {
        btn.disabled = true
        btn.classList.add('card-add-btn-disabled')
    } else {
        btn.addEventListener('click', () => agregarAlCarrito(producto._id, btn))
    }

    precioBtnDiv.appendChild(precio)
    precioBtnDiv.appendChild(btn)

    infoDiv.appendChild(marcaCategoria)
    infoDiv.appendChild(nombre)
    infoDiv.appendChild(crearEstrellas(producto))
    infoDiv.appendChild(precioBtnDiv)

    card.appendChild(infoDiv)

    return card
}


// Borra la grilla y la vuelve a dibujar entera con la lista de productos que le pasen. Si viene vacía, muestra el mensaje "No se encontraron...".
function renderizarGrid(productos) {
    productosGrid.innerHTML = ''

    if (productos.length === 0) {
        productosVacio.hidden = false
        return
    }

    productosVacio.hidden = true
    productos.forEach(p => productosGrid.appendChild(crearCardProducto(p)))
}


// La función "maestra": filtra, ordena, actualiza el contador de arriba ("X productos encontrados") y vuelve a pintar la grilla.
// Se llama cada vez que cambia cualquier filtro, el orden o la búsqueda.
function renderizarTodo() {
    const filtrados = ordenarProductos(filtrarProductos())

    productosCount.textContent = `${filtrados.length} producto${filtrados.length === 1 ? '' : 's'} encontrado${filtrados.length === 1 ? '' : 's'}`
    renderizarGrid(filtrados)
}


// Se ejecuta al hacer click en "Añadir". Si no hay token guardado (no hay sesión iniciada), manda directo a la pantalla de login. Si hay token, hace un POST a /api/carrito y muestra feedback en el botón y un toast.
async function agregarAlCarrito(productoId, btn) {
    const token = localStorage.getItem('token')

    if (!token) {
        window.location.href = './auth.html'
        return
    }

    const textoOriginal = btn.textContent

    try {
        btn.disabled = true

        const res = await fetch(`${API_URL}/carrito`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productoId, cantidad: 1 })
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.message)

        mostrarToast('Producto añadido al carrito')
        btn.textContent = 'Añadido'

        setTimeout(() => {
            btn.textContent = textoOriginal
            btn.disabled = false
        }, 1500)

    } catch (error) {
        mostrarToast(error.message, 'error')
        btn.disabled = false
    }
}


// Punto de entrada: pide los productos a la API. Si sale bien, arma los filtros, aplica lo que venga en la URL y pinta todo por primera vez. Si falla (ej: el backend está caído o hay un problema de CORS), muestra el error en el contador y en un toast, en vez de romper la página.
async function cargarProductos() {
    try {
        const res = await fetch(`${API_URL}/productos`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.message)

        productosOriginales = data.body

        inicializarFiltros()
        aplicarFiltrosDesdeQuery()
        renderizarTodo()

    } catch (error) {
        productosCount.textContent = 'Error al cargar productos'
        mostrarToast(error.message, 'error')
    }
}

cargarProductos()


// A partir de acá: un addEventListener por cada control de filtro.
// Todos siguen la misma receta: actualizar "filtros" (o "ordenActual") y llamar a renderizarTodo() para refrescar la pantalla.

// Slider de precio: cada vez que lo movés, actualiza el tope de precio
precioSlider.addEventListener('input', () => {
    filtros.precioMax = Number(precioSlider.value)
    actualizarPrecioLabel()
    renderizarTodo()
})

// Botones de "Todas / 3★+ / 4★+ / 4.5★+": marca el clickeado como activo (le saca la clase activa a los demás) y filtra por esa valoración mínima
ratingPills.forEach(btn => {
    btn.addEventListener('click', () => {
        ratingPills.forEach(b => b.classList.remove('rating-pill-active'))
        btn.classList.add('rating-pill-active')
        filtros.ratingMin = Number(btn.dataset.rating)
        renderizarTodo()
    })
})

// Checkbox "Solo con stock"
stockCheckbox.addEventListener('change', () => {
    filtros.soloStock = stockCheckbox.checked
    renderizarTodo()
})

// Select de orden (Relevancia / Precio asc / Precio desc / Mejor valorados)
ordenSelect.addEventListener('change', () => {
    ordenActual = ordenSelect.value
    renderizarTodo()
})

// Buscador del header, con "debounce": espera 300ms sin que tipees nada
// antes de filtrar, para no re-dibujar la pantalla en cada tecla
let busquedaTimeout
buscadorInput.addEventListener('input', (e) => {
    clearTimeout(busquedaTimeout)

    busquedaTimeout = setTimeout(() => {
        filtros.busqueda = e.target.value.trim().toLowerCase()
        renderizarTodo()
    }, 300)
})

// Botón "Categorias" del header: abre/cierra el menú desplegable
const categoriasBtn = document.getElementById('categorias-btn')
categoriasBtn.addEventListener('click', e => {
    e.preventDefault()

    const dropDown = document.querySelector('.dropdown')

    if (dropDown.classList.contains('dropdown-active')) dropDown.classList.remove('dropdown-active')
    else dropDown.classList.add('dropdown-active')
})
