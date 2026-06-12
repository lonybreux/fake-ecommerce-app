import mongoose from "mongoose"
import { MONGODB_URI } from "./env.js"

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI)

        console.log('mongodb conectado correctamente')
    } catch(error) {
        console.error('error conectando a mongodb', error instanceof Error ? error.message : 'Error en conexión a la base de datos')
        process.exit(1)
    }
}

export default connectDB
