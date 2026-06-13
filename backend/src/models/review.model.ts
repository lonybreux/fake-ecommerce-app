import { Document, model, Schema, Types} from "mongoose";

type Rating = 0 | 1 | 2 | 3 | 4 | 5

export interface IReview extends Document {
    clienteId: Types.ObjectId
    productoId: Types.ObjectId
    rating: Rating
}

export interface ICreateReview {
    clienteId: Types.ObjectId
    productoId: Types.ObjectId
    rating: Rating
}

const reviewSchema = new Schema<IReview>({
    clienteId: {type: Types.ObjectId, ref: 'Cliente', required: true},
    productoId: {type: Types.ObjectId, ref: 'Producto', required: true},
    rating: {type: Number, enum: [0,1,2,3,4,5], default: 0}
},{timestamps: true})

export const ReviewModel = model<IReview>('Review',reviewSchema)
