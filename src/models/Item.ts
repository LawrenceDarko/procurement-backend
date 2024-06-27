import { Schema, model, Document } from 'mongoose';

interface IItem extends Document {
    name: string;
    description: string;
    // price: number;
    category?: Schema.Types.ObjectId;
    subCategory?: Schema.Types.ObjectId;
    organization: Schema.Types.ObjectId;
}

const itemSchema = new Schema<IItem>({
    name: { type: String, required: true },
    description: { type: String },
    // price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'ItemCategory' },
    subCategory: { type: Schema.Types.ObjectId, ref: 'ItemSubCategory' },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
}, { timestamps: true });

export default model<IItem>('Item', itemSchema);
