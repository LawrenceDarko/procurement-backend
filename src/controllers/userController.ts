import { Request, Response } from 'express';
import User from '../models/User';
import Role from '../models/Role';
// import { hashPassword, validatePassword } from '../utils/hashPassword';
import { generateToken } from '../utils/generateToken';
import { hashPassword } from '../utils/hashPassword';
import { validatePassword } from '../utils/validatePassword';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, roleName } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: 'Role does not exist' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role._id,
    });

    const token = generateToken(user._id, role.name);

    res.status(201).json({ token });
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

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, (user.role as any).name);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().populate('role');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate('role');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
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

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  // Invalidate token logic should be here (depends on how token is managed)
  res.status(200).json({ message: 'User logged out successfully' });
};
