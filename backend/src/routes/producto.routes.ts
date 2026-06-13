import { Router } from "express";
import ProductoController from "../controllers/producto.controller.js";
import ProductoService from "../services/producto.service.js";
import ProductoRepository from "../repositories/producto.repository.js";



const router = Router()

const productoRepository = new ProductoRepository()
const productoService = new ProductoService(productoRepository)
const productoController = new ProductoController(productoService)

router.get('/',productoController.getProductos)
router.get('/:id',productoController.getProductoById)

export default router