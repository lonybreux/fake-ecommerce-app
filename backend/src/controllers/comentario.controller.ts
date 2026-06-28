import { Types } from "mongoose";
import type { ICreateComentarioDto } from "../models/comentario.model.js";
import type ComentarioService from "../services/comentario.service.js";
import type { Request, Response } from "express";


export default class ComentarioController {

    constructor(private comentarioService: ComentarioService){}

    public getComentarios = async (_req: Request, res: Response): Promise<void> => {
        try {
            const comentarios = await this.comentarioService.findAllComentarios()

            res.json({
                body: comentarios
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public getComentariosByClienteId = async (req: Request, res: Response): Promise<void> => {
        try {
            const id  = req.user?._id

            if(!id) {
                res.status(400).json({
                    message: 'id de cliente requerido'
                })
                return
            }

            const comentarios = await this.comentarioService.findComentariosByClienteId(id)

            res.json({
                body: comentarios
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public postComentario = async(req: Request, res: Response): Promise<void> => {
        try {
            const { contenido } = req.body
            const clienteId = req.user?._id

            if(!clienteId || !contenido) {
                res.status(400).json({
                    message: 'todos los campos son requeridos'
                })
                return
            }

            const newComentario: ICreateComentarioDto = {
                clienteId: new Types.ObjectId(clienteId),
                contenido
            }

            const comentario = await this.comentarioService.createComentario(newComentario)

            res.json({
                body: comentario
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public deleteComentario = async(req:Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params

            if(!id) {
                res.status(400).json({
                    message: 'campo id requerido'
                })
                return  
            }

            await this.comentarioService.deleteComentario(id as string)

            res.json({
                message: 'comentario eliminado correctamente'
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