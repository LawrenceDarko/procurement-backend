import { Schema, model, Document } from 'mongoose';

interface IRole extends Document {
    title: string;
    name: string;
    description: string;
}

const roleSchema = new Schema<IRole>({
    title: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
}, { timestamps: true });

const Role = model<IRole>('Role', roleSchema);

export default Role;
export { IRole };
