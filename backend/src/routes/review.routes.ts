import { Router } from "express"
import ReviewController from "../controllers/review.controller.js"
import ReviewService from "../services/review.service.js"
import ReviewRepository from "../repositories/review.repository.js"
import ProductoRepository from "../repositories/producto.repository.js"
import verificarToken from "../middlewares/auth.middleware.js"


const router = Router()

const reviewRepository = new ReviewRepository()
const productoRepository = new ProductoRepository()
const reviewService = new ReviewService(reviewRepository,productoRepository)
const reviewController = new ReviewController(reviewService)

router.get('/',reviewController.getReviews)
router.get('/producto/:id',reviewController.getReviewsByProductId)

router.post('/',verificarToken,reviewController.postReview)
router.delete('/:id',verificarToken,reviewController.deleteReview)

export default router