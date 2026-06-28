import { Router } from "express";
import PagoController from "../controllers/pago.controller.js";
import PagoService from "../services/pago.service.js";
import PagoRepository from "../repositories/pago.repository.js";
import PedidoRepository from "../repositories/pedido.repository.js";
import verificarToken from "../middlewares/auth.middleware.js";
import verificarAdmin from "../middlewares/verifyAdmin.middleware.js";

const router = Router()

const pedidoRepository = new PedidoRepository()
const pagoRepository = new PagoRepository()
const pagoService = new PagoService(pagoRepository, pedidoRepository)
const pagoController = new PagoController(pagoService)

router.get('/', verificarToken, verificarAdmin ,pagoController.getPagos)
router.get('/mis-pagos', verificarToken, pagoController.getPagosByClienteId)
router.post('/:pedidoId', verificarToken, pagoController.postPago)


export default router