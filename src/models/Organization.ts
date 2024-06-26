import { Schema, model, Document } from 'mongoose';

interface IOrganization extends Document {
    name: string;
}

const organizationSchema = new Schema<IOrganization>({
    name: { type: String, required: true, unique: true },
}, { timestamps: true });

const Organization = model<IOrganization>('Organization', organizationSchema);

export default Organization;
export { IOrganization };
