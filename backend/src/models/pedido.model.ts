import { model, Schema, Types, type Document } from "mongoose";

type EstadoPedido = 'pendiente' | 'enviado' | 'entregado' | 'cancelado'

export interface IPedido extends Document {
    clienteId: Types.ObjectId
    estado: EstadoPedido
    total: number
}

export interface ICreatePedidoDto {
    clienteId: Types.ObjectId
    total: number
}

const pedidoSchema = new Schema<IPedido>({
    clienteId: {type: Types.ObjectId, ref: 'Cliente', required: true},
    estado: {type: String, enum: ['pendiente','enviado','entregado','cancelado'] , default: 'pendiente'},
    total: {type: Number, required: true}
}, {timestamps: true})

export const PedidoModel = model<IPedido>('Pedido',pedidoSchema)