import { Schema, model, Document } from 'mongoose';

interface IItemSubCategory extends Document {
    name: string;
    description: string;
    category: Schema.Types.ObjectId;
    organization: Schema.Types.ObjectId;
}

const itemSubCategorySchema = new Schema<IItemSubCategory>({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'ItemCategory', required: true },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
}, { timestamps: true });

export default model<IItemSubCategory>('ItemSubCategory', itemSubCategorySchema);
