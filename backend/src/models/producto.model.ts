import { Document, model, Schema, Types } from "mongoose"

type Estado = 'disponible' | 'no disponible'

export interface IProducto extends Document {
    nombre: string
    precio: number
    estado: Estado
    stock: number
    marca: {
        nombre: string
        imagen: string
    }
    categoria: string
    imagen: string
    rating: number
    totalReviews: number
}

// dto para la respuesta del servidor
export interface IResponseProductoDto {
    _id: Types.ObjectId
    nombre: string
    precio: number
    estado: Estado
    stock: number
    marca: {
        nombre: string
        imagen: string
    }
    categoria: string
    imagen: string
    rating: number
    totalReviews: number
}

const productoSchema = new Schema<IProducto>({
    nombre: {type: String, required: true},
    precio: {type: Number, required: true},
    estado: {type: String, enum: ['disponible','no disponible'], default: 'disponible'},
    stock: {type: Number, required: true, min: 0, default: 0},
    marca: {nombre: {type: String, required: true}, imagen: {type: String, required: true}},
    categoria: {type: String, required: true},
    imagen: {type: String, required: true},
    rating: {type: Number, default: 0.0},
    totalReviews: {type: Number, default: 0}
}, {timestamps: true})

export const ProductoModel = model<IProducto>('Producto',productoSchema)
