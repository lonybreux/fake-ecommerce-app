import { Router } from "express";
import CarritoController from "../controllers/carrito.controller.js";
import CarritoService from "../services/carrito.service.js";
import CarritoRepository from "../repositories/carrito.repository.js";
import ProductoRepository from "../repositories/producto.repository.js";
import ClienteRepository from "../repositories/cliente.repository.js";
import verificarToken from "../middlewares/auth.middleware.js";

const clienteRepository = new ClienteRepository()
const productoRepository = new ProductoRepository()
const carritoRepository = new CarritoRepository()
const carritoService = new CarritoService(carritoRepository,clienteRepository,productoRepository)
const carritoController = new CarritoController(carritoService)

const router = Router()

router.get('/admin',verificarToken,carritoController.getCarritos)
router.get('/', verificarToken, carritoController.getCarritoByIdCliente)
router.post('/', verificarToken, carritoController.postProductoCarrito)
router.delete('/:productoId',verificarToken, carritoController.deleteProductoCarrito)


export default router
