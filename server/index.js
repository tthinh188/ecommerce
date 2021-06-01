import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { createRequire } from 'module';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

const require = createRequire(import.meta.url);
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true
}))

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/upload', uploadRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})