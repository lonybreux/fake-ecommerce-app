import { Types } from "mongoose";
import type { IPedido, EstadoPedido } from "../models/pedido.model.js";
import type IRepository from "../repositories/IRepository.js";
import type PedidoRepository from "../repositories/pedido.repository.js";
import type { ICarrito } from "../models/carrito.model.js";
import type { IProducto } from "../models/producto.model.js";

export default class PedidoService {

    constructor(private pedidoRepository: IRepository<IPedido>, private carritoRepository: IRepository<ICarrito>, private productoRepository: IRepository<IProducto>){}

    public async findAllPedidos(): Promise<IPedido[]> {
        return await this.pedidoRepository.findAll()
    }

    public async findPedidosByClienteId(id: string): Promise<IPedido[]> {
        return await (this.pedidoRepository as PedidoRepository).findMany({clienteId: new Types.ObjectId(id)})
    }

    public async createPedido(id: string): Promise<IPedido> {
        const carrito = await this.carritoRepository.findOne({clienteId: new Types.ObjectId(id)})

        if(!carrito || carrito.productos.length === 0) throw new Error('El carrito está vacio')
        
        let total = 0
        for(const p of carrito.productos) {
            const producto = await this.productoRepository.findById(p.productoId.toString())

            if(producto) total+= producto.precio * p.cantidad
        }


        const pedido = await this.pedidoRepository.create({clienteId: carrito.clienteId, total})
        await this.carritoRepository.update(carrito._id.toString(), {productos: []})

        return pedido
    }

    public async updateEstadoPedido(id: string,estado: EstadoPedido): Promise<IPedido> {
        
        const pedidoExists = await this.pedidoRepository.findById(id)

        if(!pedidoExists) throw new Error('El pedido no existe')

        pedidoExists.estado = estado

        const pedidoUpdated = await this.pedidoRepository.update(pedidoExists._id.toString(), pedidoExists)

        if(!pedidoUpdated) throw new Error('Error al actualizar pedido')
        
        return pedidoUpdated
    }
}

