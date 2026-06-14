import { Document, model, Schema, Types } from "mongoose";

export interface IComentario extends Document {
    clienteId: Types.ObjectId
    contenido: string
}

export interface ICreateComentarioDto {
    clienteId: Types.ObjectId
    contenido: string
}

const comentarioSchema = new Schema<IComentario>({
    clienteId: {type: Types.ObjectId, ref: 'Cliente', required: true},
    contenido: {type: String, required: true}
}, {timestamps: true})

export const ComentarioModel = model<IComentario>('Comentario',comentarioSchema)