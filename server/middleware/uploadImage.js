import fs from 'fs';

const uploadImage = (req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ message: "No files were uploaded." })

        const file = req.files.file;

        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ message: "Size is too large." })
        }
        next();
    } catch (error) {

    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}

export default uploadImage;