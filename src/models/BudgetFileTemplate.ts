import mongoose, { Document, Schema } from 'mongoose';

interface IBudgetFileTemplate extends Document {
    filename: string;
    filepath: string;
    uploadedAt: Date;
    organization: Schema.Types.ObjectId;
}

const budgetFileTemplateSchema = new Schema<IBudgetFileTemplate>({
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
});

const BudgetFileTemplate = mongoose.model<IBudgetFileTemplate>('BudgetFileTemplate', budgetFileTemplateSchema);

export default BudgetFileTemplate;
