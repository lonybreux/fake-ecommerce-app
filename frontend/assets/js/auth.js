const iniciarSesionTab = document.getElementById('iniciar-sesion-tab')
const crearCuentaTab = document.getElementById('crear-cuenta-tab')
const iniciarSesionDiv = document.getElementById('iniciar-sesion-div')
const crearCuentaDiv = document.getElementById('crear-cuenta-div')

const iniciarSesionBtn = document.getElementById('iniciar-sesion-btn')
const crearCuentaBtn = document.getElementById('crear-cuenta-btn')

const iniciarSesionForm = document.getElementById('iniciar-sesion-form')
const crearCuentaForm = document.getElementById('crear-cuenta-form')

iniciarSesionTab.addEventListener('click', (e) => {

    e.preventDefault()
    
    crearCuentaTab.classList.remove('options-active')
    iniciarSesionTab.classList.add('options-active')

    iniciarSesionDiv.hidden = false
    crearCuentaDiv.hidden = true
    

})

crearCuentaTab.addEventListener('click', (e) => {
    e.preventDefault()

    iniciarSesionTab.classList.remove('options-active')
    crearCuentaTab.classList.add('options-active')

    crearCuentaDiv.hidden = false
    iniciarSesionDiv.hidden = true

})

iniciarSesionForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('iniciar-sesion-email').value 
    const contrasena = document.getElementById('iniciar-sesion-password').value 

    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                contrasena
            })
        })

        
        const data = await res.json()

        if(!res.ok) throw new Error(data.message)

        localStorage.setItem('token',data.token)
        window.location.href = '/frontend/landing.html'

    } catch(error) {
        console.log(error.message)
    }
    
})

crearCuentaForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const nombre = document.getElementById('crear-cuenta-name').value 
    const apellido = document.getElementById('crear-cuenta-lastName').value
    const email = document.getElementById('crear-cuenta-email').value
    const contrasena = document.getElementById('crear-cuenta-password').value

    try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                nombre,
                apellido,
                email,
                contrasena
            })
        })

        const data = await res.json()

        if(!res.ok) throw new Error(data.message)
        
        window.location.href = '/frontend/pages/auth.html'

    } catch(error) {
        console.log(error.message)
    }
    
})


