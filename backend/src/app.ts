import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { CLIENT_URL } from './config/env.js'
import authRouter from './routes/auth.routes.js'
import productoRouter from './routes/producto.routes.js'
import reviewRouter from './routes/review.routes.js'
import comentarioRouter from './routes/comentario.routes.js'
import carritoRouter from './routes/carrito.routes.js'
import pedidoRouter from './routes/pedido.routes.js'
import pagoRouter from './routes/pago.routes.js'
import envioRouter from './routes/envio.routes.js'


const app = express()

// middlewares
app.use(cors({
    origin: [CLIENT_URL, 'http://localhost:5500'],
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}))
app.use(morgan('dev'))
app.use(express.json())


// routes
app.use('/api/auth',authRouter)
app.use('/api/productos',productoRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/comentarios',comentarioRouter)
app.use('/api/carrito',carritoRouter)
app.use('/api/pedidos',pedidoRouter)
app.use('/api/pagos',pagoRouter)
app.use('/api/envios',envioRouter)

app.use((_req,res) => {
   res.status(404).json({
    message: 'endpoint no encontrado'
   })
})

export default app


