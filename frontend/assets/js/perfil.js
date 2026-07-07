const API_URL = 'http://localhost:3000/api'

const token = localStorage.getItem('token')

const toastContainer = document.getElementById('toast-container')

const perfilAvatar = document.getElementById('perfil-iniciales')
const perfilNombreCompleto = document.getElementById('perfil-nombre-completo')
const perfilEmail = document.getElementById('perfil-email')
const cerrarSesionBtn = document.getElementById('cerrar-sesion-btn')

const tabBtns = document.querySelectorAll('.tab-btn')
const panels = {
    pedidos: document.getElementById('pedidos-panel'),
    envios: document.getElementById('envios-panel'),
    pagos: document.getElementById('pagos-panel')
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']


// Crea un mensaje flotante (toast) abajo a la derecha, verde si es éxito
// o rojo si es error, y lo hace desaparecer solo después de 2.5 segundos.
function mostrarToast(mensaje, tipo = 'exito') {
    const toast = document.createElement('div')
    toast.classList.add('toast', tipo === 'error' ? 'toast-error' : 'toast-exito')
    toast.textContent = mensaje

    toastContainer.appendChild(toast)

    setTimeout(() => toast.remove(), 2500)
}


function formatFecha(fecha) {
    const d = new Date(fecha)
    return `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

// Genera un código legible ("ES-a1b2c") a partir del ObjectId real del pedido,
// para no mostrarle al usuario el hash de Mongo entero.
function codigoPedido(pedidoId) {
    return `ES-${String(pedidoId).slice(-5).toUpperCase()}`
}

function codigoPago(pagoId) {
    return `PAY-${String(pagoId).slice(-4).toUpperCase()}`
}


function estadoPedidoInfo(estado) {
    switch (estado) {
        case 'entregado': return { label: 'Entregado', icon: 'fa-circle-check', clase: 'badge-neutral' }
        case 'enviado': return { label: 'Enviado', icon: 'fa-truck', clase: 'badge-primary' }
        case 'cancelado': return { label: 'Cancelado', icon: 'fa-circle-xmark', clase: 'badge-primary' }
        default: return { label: 'En preparación', icon: 'fa-clock', clase: 'badge-neutral' }
    }
}

function estadoEnvioInfo(estado) {
    switch (estado) {
        case 'entregado': return { label: 'Entregado', clase: 'badge-neutral' }
        case 'enviado': return { label: 'En tránsito', clase: 'badge-primary' }
        default: return { label: 'En espera', clase: 'badge-neutral' }
    }
}

function metodoPagoInfo(metodo) {
    switch (metodo) {
        case 'paypal': return { label: 'PayPal', icon: 'fa-brands fa-paypal' }
        case 'transferencia': return { label: 'Transferencia bancaria', icon: 'fa-solid fa-building-columns' }
        default: return { label: 'Tarjeta de crédito/débito', icon: 'fa-solid fa-credit-card' }
    }
}


function crearBadge(info) {
    const span = document.createElement('span')
    span.classList.add('badge', info.clase)
    span.innerHTML = `${info.icon ? `<i class="fa-solid ${info.icon}"></i>` : ''}${info.label}`
    return span
}


// Arma la lista de productos comprados en un pedido (nombre, cantidad y precio
// unitario). Los pedidos viejos (de antes de guardar esta info) vienen con
// "productos: []", así que en esos casos no se muestra nada.
function crearListaProductosPedido(productos) {
    const lista = document.createElement('ul')
    lista.classList.add('fila-productos-lista')

    productos.forEach(item => {
        const li = document.createElement('li')
        const nombre = item.productoId?.nombre ?? 'Producto eliminado'
        li.innerHTML = `
            <span class="fila-producto-cantidad">${item.cantidad}x</span>
            <span class="fila-producto-nombre">${nombre}</span>
            <span class="fila-producto-precio">S/${item.precioUnitario.toFixed(2)} c/u</span>
        `
        lista.appendChild(li)
    })

    return lista
}


function crearFilaPedido(pedido) {
    const fila = document.createElement('div')
    fila.classList.add('fila-item', 'fila-item-pedido')

    const topRow = document.createElement('div')
    topRow.classList.add('fila-item-top')

    const totalProductos = pedido.productos.length

    const info = document.createElement('div')
    info.classList.add('fila-info')
    info.innerHTML = `
        <p class="fila-label">Pedido</p>
        <h3>${codigoPedido(pedido._id)}</h3>
        <p class="fila-sub">${formatFecha(pedido.createdAt)}${totalProductos > 0 ? ` · ${totalProductos} producto${totalProductos === 1 ? '' : 's'}` : ''}</p>
    `

    const estadoInfo = estadoPedidoInfo(pedido.estado)
    const badge = crearBadge(estadoInfo)

    const total = document.createElement('div')
    total.classList.add('fila-total')
    total.innerHTML = `
        <p class="fila-label">Total</p>
        <p class="fila-monto">S/${pedido.total.toFixed(2)}</p>
    `

    topRow.append(info, badge, total)
    fila.appendChild(topRow)

    if (totalProductos > 0) {
        fila.appendChild(crearListaProductosPedido(pedido.productos))
    }

    return fila
}


function crearFilaEnvio(envio) {
    const fila = document.createElement('div')
    fila.classList.add('fila-item')

    const icono = document.createElement('div')
    icono.classList.add('row-icon')
    icono.innerHTML = '<i class="fa-solid fa-truck"></i>'

    const info = document.createElement('div')
    info.classList.add('fila-info')
    info.innerHTML = `
        <h3>Pedido ${codigoPedido(envio.pedidoId)}</h3>
        <p class="fila-sub"><i class="fa-solid fa-location-dot"></i>${envio.direccion}</p>
    `

    const estadoInfo = estadoEnvioInfo(envio.estado)
    const badge = crearBadge(estadoInfo)

    const entrega = document.createElement('div')
    entrega.classList.add('fila-total')
    entrega.innerHTML = `
        <p class="fila-label">Entrega estimada</p>
        <p class="fila-fecha">${formatFecha(envio.fechaEntrega)}</p>
    `

    fila.append(icono, info, badge, entrega)
    return fila
}


function crearFilaPago(pago) {
    const fila = document.createElement('div')
    fila.classList.add('fila-item')

    const metodoInfo = metodoPagoInfo(pago.metodoPago)

    const icono = document.createElement('div')
    icono.classList.add('row-icon')
    icono.innerHTML = `<i class="${metodoInfo.icon}"></i>`

    const info = document.createElement('div')
    info.classList.add('fila-info')
    info.innerHTML = `
        <h3>${metodoInfo.label}</h3>
        <p class="fila-sub">Pago ${codigoPago(pago._id)} · Pedido ${codigoPedido(pago.pedidoId)}</p>
        <p class="fila-sub">${formatFecha(pago.createdAt)}</p>
    `

    const badge = crearBadge({ label: 'Completado', icon: 'fa-circle-check', clase: 'badge-neutral' })

    const importe = document.createElement('div')
    importe.classList.add('fila-total')
    importe.innerHTML = `
        <p class="fila-label">Importe</p>
        <p class="fila-monto">S/${pago.monto.toFixed(2)}</p>
    `

    fila.append(icono, info, badge, importe)
    return fila
}


function renderPanel(panel, items, crearFila, mensajeVacio) {
    panel.innerHTML = ''

    if (items.length === 0) {
        const vacio = document.createElement('p')
        vacio.classList.add('panel-vacio')
        vacio.textContent = mensajeVacio
        panel.appendChild(vacio)
        return
    }

    items.forEach(item => panel.appendChild(crearFila(item)))
}


// Cambia de pestaña, actualiza la URL (?tab=...) sin recargar la página,
// para que los links del dropdown de perfil puedan apuntar directo a cada sección.
function activarTab(tab) {
    tabBtns.forEach(btn => btn.classList.toggle('tab-btn-active', btn.dataset.tab === tab))

    Object.entries(panels).forEach(([key, panel]) => {
        panel.hidden = key !== tab
    })

    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    history.replaceState(null, '', url)
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => activarTab(btn.dataset.tab))
})


cerrarSesionBtn.addEventListener('click', () => {
    localStorage.removeItem('token')
    localStorage.removeItem('nombre')
    localStorage.removeItem('apellido')
    localStorage.removeItem('email')
    window.location.href = '../landing.html'
})


// Le pregunta al backend si el token guardado sigue siendo válido.
// Esta página requiere sesión iniciada: sin token válido, se manda a auth.html.
async function verificarSesion() {
    if (!token) {
        window.location.href = './auth.html'
        return false
    }

    const res = await fetch(`${API_URL}/auth/status`, {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` }
    })

    if (res.status === 403) {
        localStorage.removeItem('token')
        localStorage.removeItem('nombre')
        localStorage.removeItem('apellido')
        localStorage.removeItem('email')
        window.location.href = './auth.html'
        return false
    }

    return true
}


function pintarDatosUsuario() {
    const nombre = localStorage.getItem('nombre') || ''
    const apellido = localStorage.getItem('apellido') || ''
    const email = localStorage.getItem('email') || ''

    perfilNombreCompleto.textContent = `${nombre} ${apellido}`.trim()
    perfilEmail.textContent = email
    perfilAvatar.textContent = `${nombre[0] || ''}${apellido[0] || ''}`
}


// Trae pedidos y pagos del cliente en paralelo, y luego busca el envío de
// cada pedido (solo existe envío para pedidos ya pagados, así que los que
// fallan simplemente no aparecen en la pestaña "Mis envíos").
async function cargarDatosPerfil() {
    try {
        const [pedidosRes, pagosRes] = await Promise.all([
            fetch(`${API_URL}/pedidos/mis-pedidos`, { headers: { authorization: `Bearer ${token}` } }),
            fetch(`${API_URL}/pagos/mis-pagos`, { headers: { authorization: `Bearer ${token}` } })
        ])

        const pedidosData = await pedidosRes.json()
        const pagosData = await pagosRes.json()

        if (!pedidosRes.ok) throw new Error(pedidosData.message)
        if (!pagosRes.ok) throw new Error(pagosData.message)

        const pedidos = pedidosData.body.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        const pagos = pagosData.body.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        const enviosResultados = await Promise.all(
            pedidos.map(pedido =>
                fetch(`${API_URL}/envios/${pedido._id}`, { headers: { authorization: `Bearer ${token}` } })
                    .then(res => res.json().then(data => ({ ok: res.ok, body: data.body })))
                    .catch(() => ({ ok: false, body: null }))
            )
        )

        const envios = enviosResultados
            .filter(resultado => resultado.ok && resultado.body)
            .map(resultado => resultado.body)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        renderPanel(panels.pedidos, pedidos, crearFilaPedido, 'Todavía no tienes pedidos.')
        renderPanel(panels.envios, envios, crearFilaEnvio, 'Todavía no tienes envíos en camino.')
        renderPanel(panels.pagos, pagos, crearFilaPago, 'Todavía no tienes pagos registrados.')

    } catch (error) {
        mostrarToast(error.message, 'error')
    }
}


async function iniciar() {
    const sesionValida = await verificarSesion()
    if (!sesionValida) return

    pintarDatosUsuario()

    const tabInicial = new URLSearchParams(window.location.search).get('tab')
    activarTab(['pedidos', 'envios', 'pagos'].includes(tabInicial) ? tabInicial : 'pedidos')

    cargarDatosPerfil()
}

iniciar()
