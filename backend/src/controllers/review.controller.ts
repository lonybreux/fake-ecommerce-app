import type { Request, Response } from "express"
import type ReviewService from "../services/review.service.js"
import type { ICreateReviewDto } from "../models/review.model.js"
import { Types } from "mongoose"

export default class ReviewController {

    constructor(private reviewService: ReviewService){}

    public getReviews = async (_req: Request, res: Response): Promise<void> => {
        try {
            const reviews = await this.reviewService.findAllReviews()

            res.json({
                body: reviews
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public getReviewsByProductId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params

            if(!id) {
                res.status(400).json({
                    message: 'id de producto requerido'
                })
                return
            }

            const reviews = await this.reviewService.findReviewsByProductId(id as string)

            res.json({
                body: reviews
            })
            return
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public getReviewsByClienteId = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.user?._id

            if(!id) {
                res.status(400).json({
                    message: 'id de cliente requerido'
                })
                return
            }

            const reviews = await this.reviewService.findReviewsByClienteId(id)

            res.json({
                body: reviews
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public postReview = async (req: Request, res: Response): Promise<void> => {
        try {
            const { productoId, rating } = req.body
            const clienteId = req.user?._id

            if(!clienteId || !productoId || !rating) {
                res.status(400).json({
                    message: 'todos los campos son requeridos'
                })
                return 
            }

            const newReview: ICreateReviewDto = {
                clienteId: new Types.ObjectId(clienteId),
                productoId,
                rating
            }

            const review = await this.reviewService.createReview(newReview)

            res.json({
                body: review
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }

    public deleteReview = async(req: Request, res: Response): Promise<void> => {
        try  {
            const { id } = req.params

            if(!id) {
                res.status(400).json({
                    message: 'id de review requerido'
                })
                return
            }

            await this.reviewService.deleteReview(id as string)

            res.json({
                message: 'review eliminado correctamente'
            })
            return
        } catch(error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            })
            return
        }
    }
}