import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import type ClienteService from '../services/cliente.service.js';
import type { ICreateClienteDto, IResponseClienteDto } from '../models/cliente.model.js';
import { JWT_SECRET } from '../config/env.js';

export default class AuthController {

    constructor(private clienteService: ClienteService){}

    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nombre, apellido, email, contrasena } = req.body

            if(!nombre || !apellido || !email || !contrasena) {
                res.status(400).json({
                    message: 'todos los campos son requeridos'
                })
                return
            }

            const newCliente: ICreateClienteDto = {
                nombre,
                apellido,
                email,
                contrasena: await bcrypt.hash(contrasena,10)
            }

            const cliente = await this.clienteService.createCliente(newCliente)

            const clienteResponse: IResponseClienteDto = {
                _id: cliente._id,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                email: cliente.email,
                estado: cliente.estado,
                rol: cliente.rol
            }

            res.status(201).json({
                message: 'Cliente registrado correctamente',
                body: clienteResponse
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, contrasena } = req.body

            if(!email || !contrasena) {
                res.status(400).json({
                    message: 'todos los campos son requeridos'
                })
                return
            }

            const clienteExists = await this.clienteService.findOneClienteByEmail(email)

            if(!clienteExists) {
                res.status(400).json({
                    message: 'Credenciales invalidas'
                })
                return
            } 

            if(!await bcrypt.compare(contrasena,clienteExists.contrasena)) {
                res.status(400).json({
                    message: 'Credenciales invalidas'
                })
                return
            }

            const token = jwt.sign({_id: clienteExists._id, rol: clienteExists.rol},JWT_SECRET,{expiresIn: '2h'})

            const clienteResponse: IResponseClienteDto = {
                _id: clienteExists._id,
                nombre: clienteExists.nombre,
                apellido: clienteExists.apellido,
                email: clienteExists.email,
                estado: clienteExists.estado,
                rol: clienteExists.rol
            }

            res.json({
                token,
                body: clienteResponse
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
        }
    }
}