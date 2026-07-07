import { model, Schema, Types, type Document } from "mongoose";
import type { IProducto } from "./producto.model.js";

export interface ICarrito extends Document {
    clienteId: Types.ObjectId
    productos: {
        productoId: Types.ObjectId
        cantidad: number
    }[]
}

export interface ICreateCarritoDto {
    clienteId: Types.ObjectId
    productos: {
        productoId: Types.ObjectId
        cantidad: number
    }[]
}

export interface ICarritoPopulado extends Omit<ICarrito, 'productos'> {
    productos: {
        productoId: IProducto,
        cantidad: number
    }[]
}

const carritoSchema = new Schema<ICarrito>({
    clienteId: {type: Types.ObjectId, ref: 'Cliente',required: true},
    productos: [{
        productoId: {type: Types.ObjectId, ref: 'Producto' ,required: true},
        cantidad: {type: Number, required: true}
    }]
}, {timestamps: true})

export const CarritoModel = model<ICarrito>('Carrito',carritoSchema)