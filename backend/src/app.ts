import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { CLIENT_URL } from './config/env.js'
import authRouter from './routes/auth.routes.js'
import productoRouter from './routes/producto.routes.js'

const app = express()

// middlewares
app.use(cors({
    origin: CLIENT_URL,
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}))
app.use(morgan('dev'))
app.use(express.json())


// routes
app.use('/api/auth',authRouter)
app.use('/api/productos',productoRouter)

app.use((_req,res) => {
   res.status(404).json({
    message: 'endpoint no encontrado'
   })
})

export default app


