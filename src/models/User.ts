import { Schema, model, Document } from 'mongoose';
import { IRole } from './Role';
import { IOrganization } from './Organization';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: IRole['_id'];
    image: string;
    organization: IOrganization['_id'];
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    image: { type: String},
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
}, { timestamps: true });

const User = model<IUser>('User', userSchema);

export default User;
export { IUser };
