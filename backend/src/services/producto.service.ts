import type { IProducto } from "../models/producto.model.js";
import type IRepository from "../repositories/IRepository.js";

export default class ProductoService {

    constructor(private repository: IRepository<IProducto>){}

    public async findAllProductos(): Promise<IProducto[]> {
        return await this.repository.findAll()
    }

    public async findProductoById(id: string): Promise<IProducto> {
        const producto = await this.repository.findById(id)

        if(!producto) throw new Error('El producto no existe')
        
        return producto
    }
}