import { Types } from "mongoose";
import type { EstadoEnvio, ICreateEnvioDto, IEnvio } from "../models/envio.model.js";
import type IRepository from "../repositories/IRepository.js";

export default class EnvioService {


    constructor(private envioRepository: IRepository<IEnvio>){}

    public async findAllEnvios(): Promise<IEnvio[]> {
        return await this.envioRepository.findAll()
    }

    public async findEnvioByPedidoId(pedidoId: string): Promise<IEnvio> {
        const envio = await this.envioRepository.findOne({pedidoId: new Types.ObjectId(pedidoId)})
        if(!envio) throw new Error('El envio no existe')
        
        return envio
    }

    public async createEnvio(pedidoId: string, direccion: string): Promise<IEnvio> {
        const envioExists = await this.envioRepository.findOne({pedidoId: new Types.ObjectId(pedidoId)})

        if(envioExists) throw new Error('Ya existe un envio para este pedido')
        
        const fechaEntrega = new Date()
        fechaEntrega.setDate(fechaEntrega.getDate() + 7)

        const nuevoEnvio: ICreateEnvioDto = {
            pedidoId: new Types.ObjectId(pedidoId),
            fechaEntrega,
            direccion
        }

        return await this.envioRepository.create(nuevoEnvio)
    }

    public async updateEstadoEnvio(pedidoId: string, estadoEnvio: EstadoEnvio): Promise<IEnvio> {
        const envioExists = await this.envioRepository.findOne({pedidoId: new Types.ObjectId(pedidoId)})

        if(!envioExists) throw new Error('El envio no existe')

        const envioUpdated = await this.envioRepository.update(envioExists._id.toString(), {estado: estadoEnvio})

        if(!envioUpdated) throw new Error('Error al actualizar envio')

        return envioUpdated
    }
}