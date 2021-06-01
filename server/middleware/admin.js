import db from '../database/mysql.js';
import util from 'util';
const query = util.promisify(db.query).bind(db);

const admin = async (req, res, next) => {
    try {
        const user = await query(`SELECT * FROM user WHERE userId=${req.user.id}`);
        if (user[0].role !== 'admin')
            return res.status(500).json({ message: "Access denied." });
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export default admin;