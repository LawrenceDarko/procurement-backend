import { Schema, model, Document } from 'mongoose';

interface IItemCategory extends Document {
    name: string;
    description: string;
    organization: Schema.Types.ObjectId;
}

const itemCategorySchema = new Schema<IItemCategory>({
    name: { type: String, required: true },
    description: { type: String },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
}, { timestamps: true });

export default model<IItemCategory>('ItemCategory', itemCategorySchema);
