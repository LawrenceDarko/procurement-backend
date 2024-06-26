import { Schema, model, Document } from 'mongoose';
import { IOrganization } from './Organization';

interface IRole extends Document {
    name: string;
    description: string;
    organization: IOrganization['_id'];
}

const roleSchema = new Schema<IRole>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
}, { timestamps: true });

const Role = model<IRole>('Role', roleSchema);

export default Role;
export { IRole };
