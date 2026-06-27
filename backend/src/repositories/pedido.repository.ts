import type { IPedido } from "../models/pedido.model.js";
import type IRepository from "./IRepository.js";
import { PedidoModel } from "../models/pedido.model.js";


export default class PedidoRepository implements IRepository<IPedido> {

    public async findAll(): Promise<IPedido[]> {
        return await PedidoModel.find()
    }
    public async findById(id: string): Promise<IPedido | null> {
        return await PedidoModel.findById(id)
    }
    public async findOne(entity: Partial<IPedido>): Promise<IPedido | null> {
        return await PedidoModel.findOne(entity)
    }
    public async findMany(entity: Partial<IPedido>): Promise<IPedido[]> {
        return await PedidoModel.find(entity)
    }

    public async create(entity: Partial<IPedido>): Promise<IPedido> {
        return await PedidoModel.create(entity)
    }
    public async update(id: string, entity: Partial<IPedido>): Promise<IPedido | null> {
        return await PedidoModel.findByIdAndUpdate(id,entity,{new: true, runValidators: true})
    }
    public async delete(id: string): Promise<void> {
        await PedidoModel.findByIdAndDelete(id)
    }
}