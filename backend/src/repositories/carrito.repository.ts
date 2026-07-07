import type { ICarrito } from "../models/carrito.model.js";
import type IRepository from "./IRepository.js";
import { CarritoModel } from "../models/carrito.model.js";

export default class CarritoRepository implements IRepository<ICarrito> {

    public async findAll(): Promise<ICarrito[]> {
       return await CarritoModel.find().populate('productos.productoId','nombre precio estado stock marca categoria imagen rating totalReviews')
    }
    public async findById(id: string): Promise<ICarrito | null> {
       return await CarritoModel.findById(id)
    }
    public async findOne(entity: Partial<ICarrito>): Promise<ICarrito | null> {
       return await CarritoModel.findOne(entity).populate('productos.productoId','nombre precio estado stock marca categoria imagen rating totalReviews')
    }
    public async create(entity: Partial<ICarrito>): Promise<ICarrito> {
        return await CarritoModel.create(entity)
    }
    public async update(id: string, entity: Partial<ICarrito>): Promise<ICarrito | null> {
        return await CarritoModel.findByIdAndUpdate(id, entity, {new: true, runValidators: true})
    }
    public async delete(id: string): Promise<void> {
        await CarritoModel.findByIdAndDelete(id)
    }

}