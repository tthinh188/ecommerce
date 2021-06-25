import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        
        if (!token) return res.status(400).json({ message: "Invalid Authorization." });

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) return res.status(400).json({ message: "Invalid Authorization." })
            req.user = user;
            next();
        });
    } catch (error) {
        if (err) return res.status(400).json({ message: error.message })
    }

}

export default auth;