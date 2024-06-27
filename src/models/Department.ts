import { Schema, model, Document } from 'mongoose';
import { IOrganization } from './Organization';
import SubDepartment from './SubDepartment';

interface IDepartment extends Document {
    name: string;
    organization: IOrganization['_id'];
}

const departmentSchema = new Schema<IDepartment>({
    name: { type: String, required: true },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
}, { timestamps: true });

departmentSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        await SubDepartment.deleteMany({ department: this._id });
        next();
    } catch (err: any) {
        next(err);
    }
});

const Department = model<IDepartment>('Department', departmentSchema);

export default Department;
export { IDepartment };
