import express from 'express';
import uploadImage from '../middleware/uploadImage.js';
import { uploadAvatar } from '../controller/uploadController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/upload_avatar', auth, uploadImage, uploadAvatar)
export default router;