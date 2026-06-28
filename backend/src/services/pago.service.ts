import { Types } from "mongoose";
import type { ICreatePagoDto, IPago, MetodoPago } from "../models/pago.model.js";
import type IRepository from "../repositories/IRepository.js";
import type PagoRepository from "../repositories/pago.repository.js";
import type { IPedido } from "../models/pedido.model.js";

export default class PagoService {

    constructor(private pagoRepository: IRepository<IPago>, private pedidoRepository: IRepository<IPedido>){}

    public async findAllPagos(): Promise<IPago[]> {
        return await this.pagoRepository.findAll()
    }

    public async findPagosByClienteId(id: string): Promise<IPago[]> {
        return await (this.pagoRepository as PagoRepository).findMany({clienteId: new Types.ObjectId(id)})
    }

    public async createPago(clienteId: string,pedidoId: string, metodoPago: MetodoPago): Promise<IPago> {
        const pedidoExists = await this.pedidoRepository.findById(pedidoId)

        if(!pedidoExists) throw new Error('El pedido no existe')
        if(!pedidoExists.clienteId.equals(clienteId)) throw new Error('Este pedido no pertenece a este cliente')

        const pago: ICreatePagoDto = {
            pedidoId: pedidoExists._id,
            clienteId: pedidoExists.clienteId,
            monto: pedidoExists.total,
            metodoPago
        }

        return await this.pagoRepository.create(pago)
    }

}