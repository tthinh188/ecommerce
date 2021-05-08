import express from 'express';
import { getAllUsers, signIn, signUp } from '../controller/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/signin', signIn);
router.post('/signup', signUp);

export default router;