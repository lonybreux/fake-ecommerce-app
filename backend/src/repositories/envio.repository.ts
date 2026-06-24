import type { IEnvio } from "../models/envio.model.js";
import type IRepository from "./IRepository.js";
import { EnvioModel } from "../models/envio.model.js";


export default class EnvioRepository implements IRepository<IEnvio> {
    public async findAll(): Promise<IEnvio[]> {
        return await EnvioModel.find()
    }
    public async findById(id: string): Promise<IEnvio | null> {
        return await EnvioModel.findById(id)
    }
    public async findOne(entity: Partial<IEnvio>): Promise<IEnvio | null> {
        return await EnvioModel.findOne(entity)
    }
    public async create(entity: Partial<IEnvio>): Promise<IEnvio> {
        return await EnvioModel.create(entity)
    }
    public async update(id: string, entity: Partial<IEnvio>): Promise<IEnvio | null> {
        return await EnvioModel.findByIdAndUpdate(id,entity, {new: true, runValidators: true})
    }
    public async delete(id: string): Promise<void> {
        await EnvioModel.findByIdAndDelete(id)
    }
    
}