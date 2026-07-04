import { Router } from "express";
import ProductoController from "../controllers/producto.controller.js";
import ProductoService from "../services/producto.service.js";
import ProductoRepository from "../repositories/producto.repository.js";
import verificarToken from "../middlewares/auth.middleware.js";
import verificarAdmin from "../middlewares/verifyAdmin.middleware.js";



const router = Router()

const productoRepository = new ProductoRepository()
const productoService = new ProductoService(productoRepository)
const productoController = new ProductoController(productoService)

router.get('/',productoController.getProductos)
router.get('/:nombre',productoController.getProductoByNombre)
router.get('/:id',productoController.getProductoById)
router.patch('/admin/:id',verificarToken, verificarAdmin, productoController.patchProducto)

export default router