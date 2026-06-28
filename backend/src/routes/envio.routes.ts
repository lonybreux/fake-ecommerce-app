import { Router } from "express";
import EnvioController from "../controllers/envio.controller.js";
import EnvioService from "../services/envio.service.js";
import EnvioRepository from "../repositories/envio.repository.js";
import verificarToken from "../middlewares/auth.middleware.js";
import verificarAdmin from "../middlewares/verifyAdmin.middleware.js";

const router = Router()

const envioRepository = new EnvioRepository()
const envioService = new EnvioService(envioRepository)
const envioController = new EnvioController(envioService)

router.get('/', verificarToken, verificarAdmin ,envioController.getEnvios)
router.get('/:pedidoId', verificarToken, envioController.getEnvioByPedidoId)
router.post('/:pedidoId',verificarToken ,envioController.postEnvio)
router.patch('/:pedidoId', verificarToken, verificarAdmin, envioController.patchEnvio)

export default router