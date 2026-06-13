import type { Request, Response } from "express"
import type ProductoService from "../services/producto.service.js"
import type { IResponseProductoDto } from "../models/producto.model.js"

export default class ProductoController {

    constructor(private productoService: ProductoService){}

    public getProductos = async (_req: Request, res: Response): Promise<void> => {
        try {
            const productos = await this.productoService.findAllProductos()

            const productosResponse: IResponseProductoDto[] = productos.map(p => ({
                _id: p._id,
                nombre: p.nombre,
                precio: p.precio,
                estado: p.estado,
                marca: p.marca,
                categoria: p.categoria,
                imagen: p.imagen,
                rating: p.rating,
                totalReviews: p.totalReviews
            }))

            res.json({
                body: productosResponse
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
        }
    }

    public getProductoById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params

            if(!id) {
                res.status(400).json({
                    message: 'Id de producto requerido'
                })
                return
            }

            const producto = await this.productoService.findProductoById(id as string)

            const productoResponse: IResponseProductoDto = {
                _id: producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                estado: producto.estado,
                marca: producto.marca,
                categoria: producto.categoria,
                imagen: producto.imagen,
                rating: producto.rating,
                totalReviews: producto.totalReviews
            }

            res.json({
                body: productoResponse
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }
}