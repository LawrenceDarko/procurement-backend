import { Schema, model, Document } from 'mongoose';
import { IOrganization } from './Organization';

interface IDepartment extends Document {
    name: string;
    organization: IOrganization['_id'];
}

const departmentSchema = new Schema<IDepartment>({
    name: { type: String, required: true },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
}, { timestamps: true });

const Department = model<IDepartment>('Department', departmentSchema);

export default Department;
export { IDepartment };
