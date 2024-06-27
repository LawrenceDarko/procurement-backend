import { Schema, model, Document } from 'mongoose';
import ItemSubCategory from './ItemSubCategory';

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

itemCategorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        await ItemSubCategory.deleteMany({ category: this._id });
        next();
    } catch (err: any) {
        next(err);
    }
});

export default model<IItemCategory>('ItemCategory', itemCategorySchema);
