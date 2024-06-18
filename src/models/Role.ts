import { Schema, model, Document } from 'mongoose';

interface IRole extends Document {
    name: string;
    permissions: {
        AdministratorAccess: string[];
        UserManagement: string[];
        ContentManagement: string[];
        FinancialManagement: string[];
        Reporting: string[];
        Payroll: string[];
        DisputesManagement: string[];
        APIControls: string[];
        DatabaseManagement: string[];
        RepositoryManagement: string[];
    };
}

const roleSchema = new Schema<IRole>({
    name: { type: String, required: true, unique: true },
    permissions: {
        AdministratorAccess: { type: [String], default: [] },
        UserManagement: { type: [String], default: [] },
        ContentManagement: { type: [String], default: [] },
        FinancialManagement: { type: [String], default: [] },
        Reporting: { type: [String], default: [] },
        Payroll: { type: [String], default: [] },
        DisputesManagement: { type: [String], default: [] },
        APIControls: { type: [String], default: [] },
        DatabaseManagement: { type: [String], default: [] },
        RepositoryManagement: { type: [String], default: [] },
    },
}, { timestamps: true });

const Role = model<IRole>('Role', roleSchema);

export default Role;
export { IRole };
