import { Router } from "express"
import ComentarioController from "../controllers/comentario.controller.js"
import ComentarioService from "../services/comentario.service.js"
import ComentarioRepository from "../repositories/comentario.repository.js"
import ClienteRepository from "../repositories/cliente.repository.js"
import verificarToken from "../middlewares/auth.middleware.js"


const router = Router()

const clienteRepository = new ClienteRepository()
const comentarioRepository = new ComentarioRepository()
const comentarioService = new ComentarioService(comentarioRepository,clienteRepository)
const comentarioController = new ComentarioController(comentarioService)

router.get('/',comentarioController.getComentarios)
router.post('/',verificarToken,comentarioController.postComentario)
router.delete('/:id',verificarToken,comentarioController.deleteComentario)

export default router