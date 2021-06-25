import cloudinary from 'cloudinary';
import fs from 'fs';
import db from '../database/mysql.js';
import util from 'util';
const query = util.promisify(db.query).bind(db);

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


export const uploadAvatar = async (req, res) => {
    try {
        const user = req.user;

        const file = req.files.file;
        
        const currentAvatar = await query(`SELECT avatarId FROM user WHERE userId=${user.id}`)
        if (currentAvatar[0].avatarId) {
            cloudinary.v2.uploader.destroy(currentAvatar[0].avatarId,
                {
                    folder: 'avatar'
                }, async (err, result) => {
                    if (err) console.log(err);
                })
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: 'avatar', width: 150, height: 150, crop: "fill"
        }, async (err, result) => {
            if (err) throw err;

            removeTmp(file.tempFilePath)

            await query(`UPDATE USER SET avatarId='${result.public_id}', userAvatar='${result.secure_url}' WHERE userId = ${user.id}`)
            
            const updatedUser = await query(`SELECT * FROM user WHERE userId = ${user.id}`)

            res.status(200).json(updatedUser[0]);
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}