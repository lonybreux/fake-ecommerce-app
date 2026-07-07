const perfilDropdown = document.getElementById('perfil-dropdown')
const perfilNombre = document.getElementById('perfil-nombre')
const fotoPerfil = document.getElementById('foto-perfil-dropdown')
async function getTokenStatus() {

    const token = localStorage.getItem('token')

    if(!token) {
        perfilDropdown.style.display = 'none'
        localStorage.removeItem('nombre')
        localStorage.removeItem('apellido')
        localStorage.removeItem('email')
        window.location.href = '/frontend/landing.html'
        return
    }

    const res = await fetch('http://localhost:3000/api/auth/status', {
        method: 'GET',
        headers: {'authorization': `Bearer ${token}`}
    })


    if(res.status === 403) {
        localStorage.removeItem('token')
        localStorage.removeItem('nombre')
        localStorage.removeItem('apellido')
        localStorage.removeItem('email')
        perfilDropdown.style.display = 'none'
        window.location.href = '/frontend/landing.html'
        return
    }

    if(res.ok) {
        console.log('token válido, ocultando botón')
        perfilDropdown.style.display = 'flex'
        const nombre = localStorage.getItem('nombre')
        perfilNombre.textContent = `Hola, ${nombre}`

        const apellido = localStorage.getItem('apellido')
        fotoPerfil.innerHTML = `<p>${nombre[0]}${apellido[0]}`
    }
}

console.log('token', localStorage.getItem('token'))
getTokenStatus().then()

const perfilBtn = document.getElementById('perfil-btn')

perfilBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const listaPerfil = document.getElementById('perfil-lista')
    
    if(listaPerfil.classList.contains('perfil-lista-active')) listaPerfil.classList.remove('perfil-lista-active')
    else listaPerfil.classList.add('perfil-lista-active')

    const cerrarSesionBtn = document.getElementById('cerrar-sesion-btn')
    cerrarSesionBtn.addEventListener('click', () => {
        localStorage.removeItem('token')
        localStorage.removeItem('nombre')
        localStorage.removeItem('apellido')
        localStorage.removeItem('email')
        window.location.href = '/frontend/landing.html'
    })
})


async function getCarrito() {
    try {
        const token = localStorage.getItem('token')

        const res = await fetch('http://localhost:3000/api/carrito',{
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'authorization':`Bearer ${token}`
            }
        })

        const data = await res.json()

        const subtotalSpan = document.getElementById('subtotal-resumen-monto')
        const totalSpan = document.getElementById('total-resumen-monto')
        const pagarBtn = document.getElementById('pagar-btn')
        let total = 0

        data.body.productos.forEach(p => {
            total += (Math.round(p.productoId.precio) * p.cantidad)
        })

        subtotalSpan.textContent = `S/${total}`
        totalSpan.textContent = `S/${total}`
        pagarBtn.textContent = `Pagar S/${total}`

        console.log(data.body)
        
    } catch(error) {
        console.log(error.message)
    }
}

getCarrito()


const tarjetaBtn = document.getElementById('tarjeta-metodo-btn')
const paypalBtn = document.getElementById('paypal-metodo-btn')
const tranferenciaBtn = document.getElementById('tranferencia-metodo-btn')

const tarjetaMetodo = document.getElementById('tarjeta-metodo')
const paypalMetodo = document.getElementById('paypal-metodo')
const transferenciaMetodo = document.getElementById('transferencia-metodo')


let metodoPago = 'tarjeta'
tarjetaBtn.addEventListener('click', e => {
    e.preventDefault()

    tarjetaMetodo.classList.add('metodo-active')
    paypalMetodo.classList.remove('metodo-active')
    transferenciaMetodo.classList.remove('metodo-active')
    metodoPago = 'tarjeta'
    
})

paypalBtn.addEventListener('click', e => {
    e.preventDefault()
    tarjetaMetodo.classList.remove('metodo-active')
    paypalMetodo.classList.add('metodo-active')
    transferenciaMetodo.classList.remove('metodo-active')
    metodoPago = 'paypal'
})

tranferenciaBtn.addEventListener('click', e => {
    e.preventDefault()
    tarjetaMetodo.classList.remove('metodo-active')
    paypalMetodo.classList.remove('metodo-active')
    transferenciaMetodo.classList.add('metodo-active')
    metodoPago = 'transferencia'
})

const pagarBtn = document.getElementById('pagar-btn')
const direccionInput = document.getElementById('direccion-input')

direccionInput.addEventListener('input', () => {
    pagarBtn.classList.toggle('pagar-active', direccionInput.value.trim().length > 0)
})

pagarBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const main = document.getElementById('main-pago')
    main.style.display = 'none'

    const mainExito = document.getElementById('main-pago-realizado')
    mainExito.style.display = 'flex'

    const total = document.getElementById('total-resumen-monto')
    const totalNum = Number(total.textContent.split('/')[1])
    crearPedido(direccionInput.value,metodoPago,totalNum)
    
})

const verMisPedidosBtn = document.getElementById('ver-mis-pedidos-btn')
verMisPedidosBtn.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.href = '/frontend/pages/perfil.html?tab=pedidos'
})

const seguirComprandoBtn = document.getElementById('exito-seguir-comprando-btn')
seguirComprandoBtn.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.href = '/frontend/pages/productos.html'
})

async function crearPedido(direccion, metodoPago, total) {
    try {
        const token = localStorage.getItem('token')

        const res = await fetch('http://localhost:3000/api/carrito',{
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'authorization':`Bearer ${token}`
            }
        })

        const data = await res.json()

        console.log(data.body.clienteId)
        console.log(total)
        
        const resPedido = await fetch('http://localhost:3000/api/pedidos',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'authorization':`Bearer ${token}`
            },
            body: JSON.stringify({
                clienteId: data.body.clienteId,
                total
            })
        })

        const dataPedido = await resPedido.json()

        console.log(dataPedido.body)

        await fetch(`http://localhost:3000/api/pagos/${dataPedido.body._id}`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'authorization':`Bearer ${token}`
            },
            body: JSON.stringify({
                metodoPago
            })
        })

        await fetch(`http://localhost:3000/api/envios/${dataPedido.body._id}`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'authorization':`Bearer ${token}`
            },
            body: JSON.stringify({
                direccion
            })
        })

        
    } catch(error) {
        console.log(error.message)
    }
}