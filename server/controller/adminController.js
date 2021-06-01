import db from '../database/mysql.js';
import util from 'util';

const query = util.promisify(db.query).bind(db);

export const getAllUsers = async (req, res) => {
    try {
        const result = await query(`SELECT * FROM user`)

        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const removeUser = async (req, res) => {
    try {
        const existingUser = await query(`SELECT * FROM user WHERE userId=${req.params.id}`);
        
        if (existingUser.length === 0) return res.status(400).json({ message: "User doesn't exist" });

        console.log(existingUser[0]);
        if (existingUser[0].role === 'admin') return res.status(400).json({ message: "Cannot remove an admin" });

        await query(`DELETE FROM user WHERE userId=${req.params.id}`)

        res.status(200).json(existingUser[0])
    } catch (error) {
        
    }
}