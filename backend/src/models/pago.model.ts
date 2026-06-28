import { model, Schema, Types, type Document } from "mongoose";

export type MetodoPago = 'tarjeta' | 'paypal' | 'transferencia'

export interface IPago extends Document {
    pedidoId: Types.ObjectId
    clienteId: Types.ObjectId
    monto: number
    metodoPago: MetodoPago
}

export interface ICreatePagoDto {
    pedidoId: Types.ObjectId
    clienteId: Types.ObjectId
    monto: number
    metodoPago: MetodoPago
}

const pagoSchema = new Schema<IPago>({
    pedidoId: {type: Types.ObjectId, ref: 'Pedido', required: true},
    clienteId: {type: Types.ObjectId, ref: 'Cliente', required: true},
    monto: {type: Number, required: true},
    metodoPago: {type: String, enum: ['tarjeta','paypal','transferencia'], required: true}
}, {timestamps: true})

export const PagoModel = model<IPago>('Pago',pagoSchema)