import express from 'express'
import { registerUser, loginUser, getAllUsers, getAUser, logoutUser, deleteUser} from '../controllers/userController';

const router = express.Router();

// Create a user
router.get('/', getAllUsers)
router.get('/:userId', getAUser)
router.delete('/:userId', deleteUser)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)


export default router