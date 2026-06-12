import { type ICliente, ClienteModel } from "../models/cliente.model.js";
import type IRepository from "./IRepository.js"

export default class ClienteRepository implements IRepository<ICliente> {

    public async findAll(): Promise<ICliente[]> {
        return await ClienteModel.find()
    }
    public async findById(id: string): Promise<ICliente | null> {
        return await ClienteModel.findById(id)
    }
    public async findOne(entity: Partial<ICliente>): Promise<ICliente | null> {
        return await ClienteModel.findOne(entity)
    }
    public async create(entity: ICliente): Promise<ICliente> {
       return await ClienteModel.create(entity)
    }
    public async update(id: string, entity: Partial<ICliente>): Promise<ICliente | null> {
       return await ClienteModel.findByIdAndUpdate(id,entity,{new: true, runValidators: true})
    }
    public async delete(id: string): Promise<void> {
      await ClienteModel.findByIdAndDelete(id)
    }
    
}