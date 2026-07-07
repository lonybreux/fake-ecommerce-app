import { Router } from "express";
import PedidoController from "../controllers/pedido.controller.js";
import PedidoService from "../services/pedido.service.js";
import PedidoRepository from "../repositories/pedido.repository.js";
import CarritoRepository from "../repositories/carrito.repository.js";
import verificarToken from "../middlewares/auth.middleware.js";
import verificarAdmin from "../middlewares/verifyAdmin.middleware.js";

const router = Router()


const carritoRepository = new CarritoRepository()
const pedidoRepository = new PedidoRepository()
const pedidoService = new PedidoService(pedidoRepository,carritoRepository)
const pedidoController = new PedidoController(pedidoService)

router.get('/admin', verificarToken, verificarAdmin, pedidoController.getPedidos)
router.get('/mis-pedidos', verificarToken ,pedidoController.getPedidosByClienteId)
router.post('/', verificarToken , pedidoController.postPedido)
router.patch('/:id', verificarToken, verificarAdmin, pedidoController.patchPedido)

export default router