import { Router } from 'express'
import AuthController from '../controllers/auth.controller.js'
import ClienteService from '../services/cliente.service.js'
import ClienteRepository from '../repositories/cliente.repository.js'
const router = Router()

const clienteRepository = new ClienteRepository()
const clienteService = new ClienteService(clienteRepository)
const authController = new AuthController(clienteService)


router.post('/register', authController.register)
router.post('/login',authController.login)


export default router