import type { IPago } from "../models/pago.model.js";
import type IRepository from "./IRepository.js";
import { PagoModel } from "../models/pago.model.js";

export default class PagoRepository implements IRepository<IPago> {
    public async findAll(): Promise<IPago[]> {
       return await PagoModel.find()
    }
    public async findById(id: string): Promise<IPago | null> {
        return await PagoModel.findById(id)
    }
    public async findOne(entity: Partial<IPago>): Promise<IPago | null> {
        return await PagoModel.findOne(entity)
    }
    public async findMany(entity: Partial<IPago>): Promise<IPago[]> {
        return await PagoModel.find(entity)
    }

    public async create(entity: Partial<IPago>): Promise<IPago> {
        return await PagoModel.create(entity)
    }
    public async update(id: string, entity: Partial<IPago>): Promise<IPago | null> {
        return await PagoModel.findByIdAndUpdate(id,entity, {new: true, runValidators: true})
    }
    public async delete(id: string): Promise<void> {
       await PagoModel.findByIdAndDelete(id)
    }
    
}