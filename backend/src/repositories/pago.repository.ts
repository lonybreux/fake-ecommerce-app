import type { IPago } from "../models/pago.model.js";
import type IRepository from "./IRepository.js";
import { PagoModel } from "../models/pago.model.js";

export default class PagoRepository implements IRepository<IPago> {
    public async findAll(): Promise<IPago[]> {
       return await PagoModel.find()
    }
    public async findById(id: string): Promise<IPago | null> {
        
    }
    public async findOne(entity: Partial<IPago>): Promise<IPago | null> {
        
    }
    public async create(entity: Partial<IPago>): Promise<IPago> {
        
    }
    public async update(id: string, entity: Partial<IPago>): Promise<IPago | null> {
        
    }
    public async delete(id: string): Promise<void> {
       
    }
    
}