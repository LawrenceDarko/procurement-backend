import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    image: string;
    role: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    role: { type: String,
            enum: ['superadmin', 'admin', 'procurementofficer', 'budgetowner'],
            required: true, 
            // default: 'user' 
        }
}, { timestamps: true });

const User = model<IUser>('User', userSchema);

export default User;
export { IUser };
