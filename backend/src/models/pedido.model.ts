import { model, Schema, Types, type Document } from "mongoose";
import type { IProducto } from "./producto.model.js";

export type EstadoPedido = 'pendiente' | 'enviado' | 'entregado' | 'cancelado'

export interface IPedidoProducto {
    productoId: Types.ObjectId
    cantidad: number
    precioUnitario: number
}

export interface IPedido extends Document {
    clienteId: Types.ObjectId
    estado: EstadoPedido
    total: number
    productos: IPedidoProducto[]
}

export interface ICreatePedidoDto {
    clienteId: Types.ObjectId
    total: number
    productos: IPedidoProducto[]
}

// version del pedido con los productos populados (nombre, imagen, etc), para mostrarle al cliente que compró
export interface IPedidoPopulado extends Omit<IPedido, 'productos'> {
    productos: {
        productoId: IProducto
        cantidad: number
        precioUnitario: number
    }[]
}

const pedidoSchema = new Schema<IPedido>({
    clienteId: {type: Types.ObjectId, ref: 'Cliente', required: true},
    estado: {type: String, enum: ['pendiente','enviado','entregado','cancelado'] , default: 'pendiente'},
    total: {type: Number, required: true},
    productos: [{
        productoId: {type: Types.ObjectId, ref: 'Producto', required: true},
        cantidad: {type: Number, required: true},
        precioUnitario: {type: Number, required: true}
    }]
}, {timestamps: true})

export const PedidoModel = model<IPedido>('Pedido',pedidoSchema)