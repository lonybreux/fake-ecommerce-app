import type { Request, Response } from "express";
import type ProductoService from "../services/producto.service.js";
import type CarritoService from "../services/carrito.service.js";


export default class CarritoController {

    constructor(private carritoService: CarritoService, private productoService: ProductoService){}

    public getCarritos = async (_req: Request, res: Response): Promise<void> => {
        try {
            const carritos = await this.carritoService.findAllCarritos()

            res.json({
                body: carritos
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public getCarritoById = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = req.user?._id

            if(!id) {
                res.status(401).json({
                    message: 'No autorizado'
                })
                return
            }

            const carrito = await this.carritoService.findCarritoById(id)

            res.json({
                body: carrito
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public postProductoCarrito = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = req.user?._id 

            if(!id) {
                res.status(401).json({
                    message: 'No autorizado'
                })
                return
            }

            const { productoId, cantidad } = req.body

            if(!productoId || !cantidad) {
                res.status(400).json({
                    message: 'todos los campos son requeridos'
                })
                return 
            }

            const producto = await this.productoService.findProductoById(productoId)

            const carritoUpdated = await this.carritoService.agregarProducto(id, cantidad, producto)

            res.json({
                body: carritoUpdated
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public deleteProductoCarrito = async (req: Request, res:Response): Promise<void> => {
        try {

            const userId = req.user?._id

            if(!userId) {
                res.status(401).json({
                    message: 'No autorizado'
                })
                return
            }

            const { productoId } = req.params

            if(!productoId) {
                res.status(400).json({
                    message: 'Id de producto requerido'
                })
                return
            }

            await this.carritoService.eliminarProducto(userId, productoId as string)

            res.json({
                message: 'Producto eliminado del carrito correctamente'
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