import { type IProducto, ProductoModel } from "../models/producto.model.js";
import type IRepository from "./IRepository.js"

export default class ProductoRepository implements IRepository<IProducto> {

    public async findAll(): Promise<IProducto[]> {
        return await ProductoModel.find()
    }
    public async findById(id: string): Promise<IProducto | null> {
        return await ProductoModel.findById(id)
    }
    public async findOne(entity: Partial<IProducto>): Promise<IProducto | null> {
        return await ProductoModel.findOne(entity)
    }
    public async create(entity: Partial<IProducto>): Promise<IProducto> {
        return await ProductoModel.create(entity)
    }
    public async update(id: string, entity: Partial<IProducto>): Promise<IProducto | null> {
        return await ProductoModel.findByIdAndUpdate(id,entity,{new: true, runValidators: true})
    }
    public async delete(id: string): Promise<void> {
       await ProductoModel.findByIdAndDelete(id)
    }
    
}