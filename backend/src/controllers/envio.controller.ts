import type EnvioService from "../services/envio.service.js";
import type { Request, Response } from "express";

export default class EnvioController {

    constructor(private envioService: EnvioService){}

    public getEnvios = async (req: Request, res: Response):Promise<void> => {
        try {
            const envios = await this.envioService.findAllEnvios()

            res.json({
                body: envios
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public getEnvioByPedidoId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { pedidoId } = req.params

            if(!pedidoId) {
                res.status(400).json({
                    message: 'id de pedido requerido'
                })
                return
            }

            const envio = await this.envioService.findEnvioByPedidoId(pedidoId as string)

            res.json({
                body: envio
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public postEnvio = async (req: Request, res: Response): Promise<void> => {
        try {

            const { pedidoId } = req.params
            const { direccion } = req.body

            if(!pedidoId || !direccion) {
                res.status(400).json({
                    message: 'todos los campos son requeridos'
                })
                return
            }

            const envioCreated = await this.envioService.createEnvio(pedidoId as string, direccion)

            res.json({
                body: envioCreated
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public patchEnvio = async (req: Request, res: Response): Promise<void> => {
        try {
            const { pedidoId } = req.params

            if(!pedidoId) {
                res.status(400).json({
                    message: 'id de pedido requerido'
                })
                return
            }

            const { estado } = req.body

            if(!estado) {
                res.status(400).json({
                    message: 'estado requerido'
                })
                return
            }

            const envioUpdated = await this.envioService.updateEstadoEnvio(pedidoId as string,estado)

            res.json({
                body: envioUpdated
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