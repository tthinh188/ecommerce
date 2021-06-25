import express from 'express';
import { getUser, signIn, signUp, activateEmail, getAccessToken, forgotPassword, resetPassword, resendActivateEmail, logout, updateUser, changePassword } from '../controller/userController.js';
import { getAllUsers, removeUser } from '../controller/adminController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

router.get('/user', auth, getUser);
router.post('/signin', signIn);
router.post('/signup', signUp);
router.get('/logout', logout);
router.patch('/update', auth, updateUser);
router.post('/activate', activateEmail);
router.post('/resend_activate', resendActivateEmail);
router.post('/refresh_token', getAccessToken);
router.post('/forgot', forgotPassword);
router.patch('/reset', auth, resetPassword);
router.patch('/change_password', auth, changePassword);

router.get('/', auth, admin, getAllUsers);
router.delete('/remove/:id', auth, admin, removeUser);
export default router;