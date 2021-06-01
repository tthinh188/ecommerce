import mysql from 'mysql';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true,
});

connection.connect((err) => {
    if(err) throw err;
    console.log('MySQL Connected!');
});

export default connection;