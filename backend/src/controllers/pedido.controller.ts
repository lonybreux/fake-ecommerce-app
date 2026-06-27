import type { Request, Response } from "express"
import type PedidoService from "../services/pedido.service.js"


export default class PedidoController {

    constructor(private pedidoService: PedidoService){}

    public getPedidos = async (_req: Request, res: Response): Promise<void> => {
        try {
            const pedidos = await this.pedidoService.findAllPedidos()

            res.json({
                body: pedidos
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message: 'Internal server error'
            })
            return
        }
    }

    public getPedidosByClienteId = async (req:Request, res:Response): Promise<void> => {
        try {

            const id = req.user?._id

            if(!id) {
                res.status(400).json({
                    message: 'id de cliente requerido'
                })
                return
            }

            const pedidos = await this.pedidoService.findPedidosByClienteId(id as string)

            res.json({
                body: pedidos
            })
            return

        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public postPedido = async (req: Request, res:Response): Promise<void> => {
        try {
            
            const id = req.user?._id

            if(!id) {
                res.status(400).json({
                    message: 'id de cliente requerido'
                })
                return
            }

            const pedidoCreated = await this.pedidoService.createPedido(id as string)

            res.json({
                body: pedidoCreated
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public patchPedido = async (req:Request, res:Response): Promise<void> => {
        try {
            const { id } = req.params
            const { estado } = req.body

            if(!id || !estado) {
                res.status(400).json({
                    message: 'Todos los campos son requeridos'
                })
                return
            }

            const pedidoUpdated = await this.pedidoService.updateEstadoPedido(id as string, estado)

            res.json({
                body: pedidoUpdated
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