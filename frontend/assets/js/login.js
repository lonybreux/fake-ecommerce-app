const formLogin = document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('emailLogin').value 
    const contrasena = document.getElementById('contrasenaLogin').value

    const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            email,contrasena
        })
    })

    const data = await res.json()
    console.log(data)
})