import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1/users', userRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})