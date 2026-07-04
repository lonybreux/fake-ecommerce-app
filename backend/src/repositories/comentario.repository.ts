import { ComentarioModel, type IComentario } from "../models/comentario.model.js";
import type IRepository from "./IRepository.js";


export default class ComentarioRepository implements IRepository<IComentario> {
    public async findAll(): Promise<IComentario[]> {
        return await ComentarioModel.find().populate('clienteId','nombre apellido')
    }
    public async findById(id: string): Promise<IComentario | null> {
        return await ComentarioModel.findById(id)
    }
    public async findOne(entity: Partial<IComentario>): Promise<IComentario | null> {
        return await ComentarioModel.findOne(entity)
    }
    public async findMany(entity: Partial<IComentario>): Promise<IComentario[]> {
        return await ComentarioModel.find(entity)
    }

    public async create(entity: Partial<IComentario>): Promise<IComentario> {
        return await ComentarioModel.create(entity)
    }
    public async update(id: string, entity: Partial<IComentario>): Promise<IComentario | null> {
        return await ComentarioModel.findByIdAndUpdate(id,entity, {new: true, runValidators: true})
    }
    public async delete(id: string): Promise<void> {
        await ComentarioModel.findByIdAndDelete(id)
    }
    
}