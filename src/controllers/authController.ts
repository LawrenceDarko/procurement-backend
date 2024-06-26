import { Request, Response } from 'express';
import User from '../models/User';
import Role from '../models/Role';
import Organization from '../models/Organization';
import { generateToken } from '../utils/generateToken';
import { hashPassword } from '../utils/hashPassword';
import validatePassword from '../utils/validatePassword';
import SubDepartment from '../models/SubDepartment';
import Department from '../models/Department';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
// import { validatePassword } from '../utils/validatePassword';

export const registerOrganization = async (req: Request, res: Response) => {
    const { name, adminUsername, adminEmail, adminPassword } = req.body;

    let userImage = null
    if(req.file) {
        const uploadedImage = req.file
        userImage = uploadedImage.filename
    }

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
            image: userImage,
            role: superadminRole!._id,
            organization: organization._id,
        });

        const token = generateToken(adminUser?._id, superadminRole!.name, adminUser.organization);

        const sanitizedAdminUser = {
            _id: adminUser._id,
            username: adminUser.username,
            email: adminUser.email,
            role: adminUser.role,
            image: userImage,
            organization: adminUser.organization,
        };
        

        res.status(201).json({ success: true, data: sanitizedAdminUser, token, message: 'Organization Created Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { username, email, password, organizationId, departmentId, subDepartmentId, roleName } = req.body;

    if (!username || !email || !password || !organizationId || !roleName) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    let department, subDepartment, userImage = null;

    if (req.file) {
        userImage = req.file.filename;
    }

    try {
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(400).json({ message: 'Organization does not exist' });
        }

        if (departmentId) {
            department = await Department.findById(departmentId);
            if (!department) {
                return res.status(400).json({ message: 'Department does not exist' });
            }
        }

        if (subDepartmentId) {
            subDepartment = await SubDepartment.findById(subDepartmentId);
            if (!subDepartment) {
                return res.status(400).json({ message: 'Sub-Department does not exist' });
            }
        }

        const role = await Role.findOne({ name: roleName, organization: organization._id });
        if (!role) {
            return res.status(400).json({ message: 'Role does not exist' });
        }

        const existingUserName = await User.findOne({ username });
        if (existingUserName) {
            return res.status(400).json({ message: 'User already exists' });
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
            image: userImage,
            organization: organization._id,
            department: department?._id,
            subDepartment: subDepartment?._id
        });

        const token = generateToken(user._id, role.name, user.organization);

        const sanitizedUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            roleName: role.name,
            organization,
            image: user.image,
            department,
            subDepartment
        };

        res.status(201).json({ success: true, data: sanitizedUser, token, message: 'User created Successfully' });
    } catch (error) {
        console.log("ERROR REGISTERING USER", error)
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

        const newUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            organization: user.organization
        }

        // const token = generateToken(newUser);
        const token = generateToken(user._id, (user.role as any).name, user.organization);

        res.status(200).json({ success: true, data: newUser, token, message: "User Login Successfully" });
    } catch (error) {
        console.log("Hey ",error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const users = await User.find({ organization: req.user!.organization }).populate('organization department subDepartment role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllUsersByRole = async (req: AuthenticatedRequest, res: Response) => {
    const { roleId } = req.params;

    const roleExist = await Role.find({ organization: req.user!.organization, _id: roleId });
    if (!roleExist) {
        return res.status(400).json({ message: 'Role does not exists' });
    }

    try {
        const users = await User.find({ organization: req.user!.organization, role: roleId }).populate('organization department subDepartment role');
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
