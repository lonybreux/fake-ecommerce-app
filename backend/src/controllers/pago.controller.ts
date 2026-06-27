import type PagoService from "../services/pago.service.js";
import type { Request, Response } from "express";


export default class PagoController {

    constructor(private pagoService: PagoService){}

    public getPagos = async (_req: Request, res: Response): Promise<void> => {
        try {
            const pagos = await this.pagoService.findAllPagos()

            res.json({
                body: pagos
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public getPagosByClienteId = async (req: Request, res: Response): Promise<void> => {
        try {
            
            const id = req.user?._id

            if(!id) {
                res.status(400).json({
                    message: 'id de cliente requerido'
                })
                return
            }

            const pagos = await this.pagoService.findPagosByClienteId(id as string)

            res.json({
                body: pagos
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public postPago = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = req.user?._id


            if(!id) {
                res.status(400).json({
                    message: 'id del cliente requerido'
                })
                return
            }

            const { pedidoId } = req.params

            if(!pedidoId) {
                res.status(400).json({
                    message: 'id del pedido requerido'
                })
                return
            }

            const { metodoPago } = req.body

            if(!metodoPago) {
                res.status(400).json({
                    message: 'se requiere metodo de pago'
                })
                return
            }

            const pagoCreated = await this.pagoService.createPago(id,pedidoId as string,metodoPago)

            res.json({
                body: pagoCreated
            })
            return

        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
        }
    }
}