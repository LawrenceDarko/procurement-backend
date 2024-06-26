import { Schema, model, Document } from 'mongoose';
import { IDepartment } from './Department';

interface ISubDepartment extends Document {
    name: string;
    department: IDepartment['_id'];
}

const subDepartmentSchema = new Schema<ISubDepartment>({
    name: { type: String, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
}, { timestamps: true });

const SubDepartment = model<ISubDepartment>('SubDepartment', subDepartmentSchema);

export default SubDepartment;
export { ISubDepartment };
