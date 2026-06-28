const formRegister = document.getElementById('formRegister').addEventListener('submit', async (e) => {
    e.preventDefault()

    const nombre = document.getElementById('nombreRegister').value
    const apellido = document.getElementById('apellidoRegister').value
    const email = document.getElementById('emailRegister').value
    const contrasena = document.getElementById('contrasenaRegister').value

    const res = await fetch('http://localhost:3000/api/auth/register',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            nombre,apellido,email,contrasena
        })
    })

    const data = await res.json()
    console.log(data)

    if(res.ok) window.location.href = '/frontend/pages/login.html'

})