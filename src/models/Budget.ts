import { Schema, model, Document } from 'mongoose';

interface IBudget extends Document {
    financialYear: string;
    department: Schema.Types.ObjectId;
    subDepartment?: Schema.Types.ObjectId;
    itemCategory: Schema.Types.ObjectId;
    itemSubCategory?: Schema.Types.ObjectId;
    organization?: Schema.Types.ObjectId;
    budgetOwner: Schema.Types.ObjectId;
    item: Schema.Types.ObjectId;
    unitPrice: number;
    quantity: number;
    productSpecification: string;
    IFTNumber: string;
    currency: string;
    totalEstimatedAmount: number;
    otherItem: string;
    budgetIsLocked: boolean;
    budgetStatus: 'pending' | 'approved' | 'rejected';
}

const budgetSchema = new Schema<IBudget>({
    financialYear: { type: String, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    subDepartment: { type: Schema.Types.ObjectId, ref: 'SubDepartment' },
    itemCategory: { type: Schema.Types.ObjectId, ref: 'ItemCategory' },
    itemSubCategory: { type: Schema.Types.ObjectId, ref: 'ItemSubCategory' },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
    budgetOwner: { type: Schema.Types.ObjectId, ref: 'User' },
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    productSpecification: { type: String },
    IFTNumber: { type: String, required: true },
    currency: { type: String, required: true },
    totalEstimatedAmount: { type: Number, required: true },
    otherItem: { type: String },
    budgetIsLocked: { type: Boolean, default: false },
    budgetStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'}
}, { timestamps: true });

export default model<IBudget>('Budget', budgetSchema);
