import { model, Schema, Types, type Document } from "mongoose";

type EstadoEnvio = 'en espera' | 'enviado' | 'entregado'

export interface IEnvio extends Document {
    pedidoId: Types.ObjectId
    fechaEntrega: Date
    estado: EstadoEnvio
    direccion: string
}

export interface ICreateEnvioDto {
    pedidoId: Types.ObjectId
    fechaEntrega: Date
    direccion: string
}

const envioSchema = new Schema<IEnvio>({
    pedidoId: {type: Types.ObjectId, ref: 'Pedido', required: true},
    fechaEntrega: {type: Date, required: true},
    estado: {type: String, enum: ['en espera','enviado','entregado'], default: 'en espera'},
    direccion: {type: String, required: true}
}, {timestamps: true})

export const EnvioModel = model<IEnvio>('Envio',envioSchema)