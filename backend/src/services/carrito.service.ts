import type { ICarrito, ICreateCarritoDto } from "../models/carrito.model.js";
import type { ICliente } from "../models/cliente.model.js";
import { Types } from "mongoose";
import type IRepository from "../repositories/IRepository.js";
import type { IProducto } from "../models/producto.model.js";


export default class CarritoService {

    constructor(private carritoRepository: IRepository<ICarrito>, private clienteRepository: IRepository<ICliente>, private productoRepository: IRepository<IProducto>){}

    public async findAllCarritos(): Promise<ICarrito[]> {
        return await this.carritoRepository.findAll()
    }

    public async findCarritoById(id: string): Promise<ICarrito> {

        const clienteExists = await this.clienteRepository.findById(id)

        if(!clienteExists) throw new Error('El cliente no existe')

        const carrito = await this.carritoRepository.findOne({clienteId: clienteExists._id})

        if(!carrito) {
            const newCarrito: ICreateCarritoDto = {
                clienteId: clienteExists._id,
                productos: []
            }

            const carritoCreated = await this.carritoRepository.create(newCarrito)

            return carritoCreated
        } else {
            return carrito
        }
    }

    public async agregarProducto(id: string, cantidad: number,productoId: string): Promise<ICarrito> {
        const clienteExists = await this.clienteRepository.findById(id)
        if(!clienteExists) throw new Error('El cliente no existe')

        const productoExists = await this.productoRepository.findById(productoId)
        if(!productoExists) throw new Error('El producto no existe')


        const carritoExists = await this.carritoRepository.findOne({clienteId: clienteExists._id})

        if(!carritoExists) {
            const productoAdd = {productoId: new Types.ObjectId(productoId), cantidad}
            const newCarrito: ICreateCarritoDto = {
                clienteId: clienteExists._id,
                productos: [productoAdd]
            }

            const carritoCreated = await this.carritoRepository.create(newCarrito)

            return carritoCreated
        } else {

            const productoEnCarrito = carritoExists.productos.find(p => p.productoId.equals(productoId))
            

            if(productoEnCarrito) {
                productoEnCarrito.cantidad += cantidad
            } else {
                carritoExists.productos.push({productoId: new Types.ObjectId(productoId), cantidad})
            }
    
            
            const carritoUpdated = await this.carritoRepository.update(carritoExists._id.toString(), {productos: carritoExists.productos})

            if(!carritoUpdated) throw new Error('Error al agregar producto')
            
            return carritoUpdated
        }
    }

    public async eliminarProducto(id: string, idProducto: string): Promise<ICarrito> {
        const clienteExists = await this.clienteRepository.findById(id)
        if(!clienteExists) throw new Error('El cliente no existe')
            
        const carrito = await this.carritoRepository.findOne({clienteId: clienteExists._id})

        if(!carrito) throw new Error('El carrito no existe')
        
        const newProductosList = carrito.productos.filter(p => !p.productoId.equals(idProducto))

        const carritoUpdated = await this.carritoRepository.update(carrito._id.toString(), {productos: newProductosList})

       if(!carritoUpdated) throw new Error('Error al eliminar producto')

        return carritoUpdated
    }
}