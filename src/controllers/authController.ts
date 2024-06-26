import { Request, Response } from 'express';
import User from '../models/User';
import Role from '../models/Role';
import Organization from '../models/Organization';
import { generateToken } from '../utils/generateToken';
import { hashPassword } from '../utils/hashPassword';
import validatePassword from '../utils/validatePassword';
import SubDepartment from '../models/SubDepartment';
import Department from '../models/Department';
// import { validatePassword } from '../utils/validatePassword';

export const registerOrganization = async (req: Request, res: Response) => {
    const { name, adminUsername, adminEmail, adminPassword } = req.body;

    try {
        const organization = await Organization.create({ name });

        const roles = ['superadmin', 'admin', 'procurementofficer', 'budgetowner'];
        const roleDocs = await Promise.all(roles.map(role => 
            Role.create({ name: role, description: `${role} role`, organization: organization._id })
        ));

        const superadminRole = roleDocs.find(role => role.name === 'superadmin');

        const hashedPassword = await hashPassword(adminPassword);

        const adminUser = await User.create({
            username: adminUsername,
            email: adminEmail,
            password: hashedPassword,
            role: superadminRole!._id,
            organization: organization._id,
        });

        const token = generateToken(adminUser?._id, superadminRole!.name);

        const sanitizedAdminUser = {
            _id: adminUser._id,
            username: adminUser.username,
            email: adminUser.email,
            role: adminUser.role,
            organization: adminUser.organization,
        };
        

        res.status(201).json({ success: true, data: sanitizedAdminUser, token, message: 'Organization Created Successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    };

export const register = async (req: Request, res: Response) => {
    const { username, email, password, organizationId, departmentId, roleName } = req.body;

    if( !username || !email || !password || !organizationId || !roleName ){
        return res.status(400).json({ message: 'All fields are required'})
    }

    try {
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(400).json({ message: 'Organization does not exist' });
        }

        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(400).json({ message: 'Department does not exist' });
        }

        const role = await Role.findOne({ name: roleName, organization: organization._id });
        if (!role) {
            return res.status(400).json({ message: 'Role does not exist' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role._id,
            organization: organization!._id,
            department: department!._id
        });

        const token = generateToken(user._id, role.name);

        const sanitizedUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            roleName: role.name,
            organization: user.organization,
            department: user.department
        };

        res.status(201).json({ success: true, data: sanitizedUser, token, message: 'User created Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('role');

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await validatePassword(password, user.password);

        console.log("check ",isValidPassword)

        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, (user.role as any).name);

        const newUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            organization: user.organization
        }

        res.status(200).json({ success: true, data: newUser, token, message: "User Login Successfully" });
    } catch (error) {
        console.log("Hey ",error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().populate('role').populate('organization');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).populate('role').populate('organization');

        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, password, role, organization } = req.body;

    try {
        // Construct update object based on provided fields
        const updateFields: any = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (password) await hashPassword(password)
        if (role) {
            const userRole = await Role.findOne({ name: role, organization });
            if (!userRole) {
                return res.status(400).json({ message: 'Invalid role' });
            }
            updateFields.role = userRole._id;
        }
        if (organization) updateFields.organization = organization;

        // Find user by id and update with updateFields
        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return updated user object
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteAUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ success: false, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    // Invalidate token logic should be here (depends on how token is managed)
    res.status(200).json({ message: 'User logged out successfully' });
};
