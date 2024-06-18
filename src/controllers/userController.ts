import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import { hashPassword } from '../utils/hashPassword';
import { validatePassword } from '../utils/validatePassword';

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  let blogImage = null
  if(!username || !email || !password || !role){
      return res.status(403).json('Enter all Fields')
  }

  if(req.file) {
    const uploadedImage = req.file
    blogImage = uploadedImage.filename
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      image: blogImage,
      role: role,
    });

    const token = generateToken(user?._id, user?.role);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if(!email || !password){
    return res.status(403).json('Enter all Fields')
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await validatePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async(req: Request, res: Response) => { 
  // const id = req.user.userId
  const allUsers = await User.find({})
  try {
      res.status(200).json(allUsers)
  } catch (error) {
      res.status(400).json(error)
  }
}

// A controller to get a single user
export const getAUser = async(req: Request, res: Response) => {
  const { userId } = req.params
  const user = await User.findById(userId)

  try {
      res.status(200).json({success: true, data: user})
  } catch (error) {
      res.status(400).json(error)
  }
}

export const deleteUser = async(req: Request, res: Response) => {
  const { userId } = req.params;

  try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
      res.status(400).json({ success: false, error });
  }
};

export const logoutUser = async(req: Request, res: Response) => {
  res.clearCookie('token')
  res.status(200).json({success: true, message: "Logged out successfully"})
}
