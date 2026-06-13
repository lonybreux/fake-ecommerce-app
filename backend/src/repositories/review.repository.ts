import { ReviewModel, type IReview } from "../models/review.model.js";
import type IRepository from "./IRepository.js";


export default class ReviewRepository implements IRepository<IReview> {
    public async findAll(): Promise<IReview[]> {
        return await ReviewModel.find()
    }
    public async findById(id: string): Promise<IReview | null> {
        return await ReviewModel.findById(id)
    }
    public async findOne(entity: Partial<IReview>): Promise<IReview | null> {
        return await ReviewModel.findOne(entity)
    }
    public async create(entity: Partial<IReview>): Promise<IReview> {
        return await ReviewModel.create(entity)
    }
    public async update(id: string, entity: Partial<IReview>): Promise<IReview | null> {
        return await ReviewModel.findByIdAndUpdate(id,entity, {new: true, runValidators: true})
    }
    public async delete(id: string): Promise<void> {
        await ReviewModel.findByIdAndDelete(id)
    }

    
}