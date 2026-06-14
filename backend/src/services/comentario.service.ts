import { Types } from "mongoose";
import type { ICliente } from "../models/cliente.model.js";
import type { IComentario, ICreateComentarioDto } from "../models/comentario.model.js";
import type IRepository from "../repositories/IRepository.js";
import type ComentarioRepository from "../repositories/comentario.repository.js";


export default class ComentarioService {

    constructor(private comentarioRepository: IRepository<IComentario>,private clienteRepository: IRepository<ICliente>){}

    public async findAllComentarios(): Promise<IComentario[]> {
        return await this.comentarioRepository.findAll()
    }

    public async findComentariosByClienteId(id: string): Promise<IComentario[]> {
        const cliente = await this.clienteRepository.findById(id)

        if(!cliente) throw new Error('Este cliente no existe')
        
        return await (this.comentarioRepository as ComentarioRepository).findMany({clienteId: new Types.ObjectId(id)})
    }

    public async createComentario(comentario: ICreateComentarioDto): Promise<IComentario> {
        return await this.comentarioRepository.create(comentario)
    }

    public async deleteComentario(id: string): Promise<void> {
        await this.comentarioRepository.delete(id)
    }
}