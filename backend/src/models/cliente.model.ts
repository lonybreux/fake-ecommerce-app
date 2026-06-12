import mongoose, { Schema, Document, Types } from "mongoose";

type estado = 'activo' | 'no activo'

export interface ICliente extends Document {
    nombre: string
    apellido: string
    email: string
    contrasena: string
    estado: estado
}

// dto para la respuesta del servidor
export interface IResponseClienteDto {
    _id: Types.ObjectId
    nombre: string
    apellido: string
    email: string
    estado: estado
}

// dto para la creación de un cliente
export interface ICreateClienteDto {
    nombre: string
    apellido: string
    email: string
    contrasena: string
}

const clienteSchema = new Schema<ICliente>({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    contrasena: {type: String, required: true},
    estado: {type: String, enum: ['activo','no activo'], default: 'activo'}
    
}, {timestamps: true})

export const ClienteModel = mongoose.model<ICliente>('Cliente',clienteSchema)