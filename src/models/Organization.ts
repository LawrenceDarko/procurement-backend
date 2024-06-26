import { Schema, model, Document } from 'mongoose';

interface IOrganization extends Document {
    name: string;
    image: string;
}

const organizationSchema = new Schema<IOrganization>({
    name: { type: String, required: true, unique: true },
    image: { type: String},
}, { timestamps: true });

const Organization = model<IOrganization>('Organization', organizationSchema);

export default Organization;
export { IOrganization };
