import { Types } from "mongoose";
import type { ICreateReviewDto, IReview } from "../models/review.model.js";
import type IRepository from "../repositories/IRepository.js";
import type { IProducto } from "../models/producto.model.js";
import ReviewRepository from "../repositories/review.repository.js";



export default class ReviewService {

    constructor(private reviewRepository: IRepository<IReview>, private productoRepository: IRepository<IProducto>){}

    public async findAllReviews(): Promise<IReview[]> {
        return await this.reviewRepository.findAll()
    }

    public async findReviewsByProductId(id: string): Promise<IReview[]> {
        const productoExists = await this.productoRepository.findById(id)

        if(!productoExists) throw new Error('Este producto no existe')

        return await (this.reviewRepository as ReviewRepository).findMany({productoId: productoExists._id})
    }

    public async findReviewsByClienteId(id:string): Promise<IReview[]> {
        return await (this.reviewRepository as ReviewRepository).findMany({clienteId: new Types.ObjectId(id)})
    }

    public async createReview(review: ICreateReviewDto): Promise<IReview> {
        const newReview = await this.reviewRepository.create(review)

        const reviews = await (this.reviewRepository as ReviewRepository).findMany({productoId: review.productoId})

        const rating = reviews.reduce((sumaRatings,r) => sumaRatings + r.rating, 0) / reviews.length

        await this.productoRepository.update(review.productoId.toString(),{rating, totalReviews: reviews.length})

        return newReview
    }

    public async deleteReview(id: string): Promise<void> {
        await this.reviewRepository.delete(id)
    }
}