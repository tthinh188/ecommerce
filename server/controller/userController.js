import db from '../database/mysql.js';
import util from 'util';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const query = util.promisify(db.query).bind(db);

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await query(`SELECT * FROM user WHERE email='${email}'`)

        if(existingUser.length === 0) return res.status(400).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser[0].password); // compare brcypt password with the password stored from the db

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credential" });

        const token = jwt.sign({ email: existingUser[0].email, id: existingUser[0].userId }, 'test', { expiresIn: "1h"}); // create token with secret: "test"

        res.status(200).json({ result: existingUser[0], token }); // sending back to front end the user and token for authorization.

    } catch(error) {
        res.status(500).json({ message: "Something went wrong !" })
    }
}

export const signUp = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName} = req.body;

    try {
        const existingUser = await query(`SELECT * FROM user WHERE email='${email}'`)

        if(existingUser.length !== 0) return res.status(400).json({ message: "User already existed" });

        if(password !== confirmPassword) return res.status(400).json({ message: "Password don't match." }); 

        const hashedPassword = await bcrypt.hash(password, 12); // create hashed password , salt : 12

        const userQuery = await query(`INSERT INTO user (firstName, lastName, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}')`)
        const result = await query(`SELECT * FROM user WHERE userId =${userQuery.insertId} `)

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h"}); // create token with secret: "test"

        res.status(200).json({ result: result, token }); // sending back user to the front-end and token for authorization.
    } catch (error) {
        res.status(500).json({ message: "Something went wrong !" })
    }
}

export const getAllUsers = async (req,res) => {
    try {
        const result = await query(`SELECT * FROM user`)

        res.status(200).json(result);
    } catch (error) {
        res.status(400);
    }
}