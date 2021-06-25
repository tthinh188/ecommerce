import db from '../database/mysql.js';
import util from 'util';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from './sendMail.js';

const query = util.promisify(db.query).bind(db);
const CLIENT_URL = process.env.CLIENT_URL;

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await query(`SELECT * FROM user WHERE email='${email}'`)

        if (existingUser.length === 0) return res.status(400).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser[0].password); // compare brcypt password with the password stored from the db

        if (!isPasswordCorrect) return res.status(400).json({ message: "Incorrect password" });

        const user = {
            id: existingUser[0].userId,
            email: existingUser[0].email,
        }

        const refreshToken = createRefreshToken(user);

        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
            path: '/api/v1/users/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(200).json({ user: existingUser[0], refreshToken }); // sending back to front end the user and token for authorization.

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const signUp = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const existingUser = await query(`SELECT * FROM user WHERE email='${email}'`)

        if (existingUser.length !== 0) return res.status(400).json({ message: "User already existed" });

        if (password !== confirmPassword) return res.status(400).json({ message: "Password don't match." });

        const hashedPassword = await bcrypt.hash(password, 12); // create hashed password , salt : 12

        const userQuery = await query(`INSERT INTO user (firstName, lastName, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}')`)
        const result = await query(`SELECT * FROM user WHERE userId =${userQuery.insertId} `)

        const newUser = {
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword
        }

        const activationToken = createActivationToken(newUser);
        const url = `${CLIENT_URL}/user/activate/${activationToken}`
        sendEmail(email, url, "Verify your email address");

        const user = {
            id: result[0].userId,
            email: email,
        }
        const refreshToken = createRefreshToken(user);
        res.status(200).json({ user: result[0], refreshToken }); // sending back user to the front-end and token for authorization.
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: '/api/v1/users/refresh_token' })
        return res.json({ message: "Logged out." });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export const activateEmail = async (req, res) => {
    try {
        const { activationToken } = req.body;
        const user = jwt.verify(activationToken, process.env.ACTIVATION_TOKEN);

        await query(`UPDATE user SET verified = ${1} WHERE email = '${user.email}'`);

        res.status(200).json({ email: user.email });
    } catch (error) {
        res.status(400).json(error);
    }
}

export const resendActivateEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = {
            email,
        }
        const activationToken = createActivationToken(user);
        const url = `${CLIENT_URL}/user/activate/${activationToken}`
        sendEmail(email, url, "Verify your email address");
        res.status(200).json({ message: "The activation link has been sent to your email!" });
    } catch (error) {
        res.status(400).json(error);
    }
}

export const getAccessToken = (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) return res.status(400).json({ message: "Please login now" });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
            if (err) return res.status(400).json({ message: "Please login now" });
            const accessToken = createAccessToken({ id: user.id });
            res.json({ accessToken });
        });
        res.status(200);
    } catch (error) {
        res.status(400).json(error);
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await query(`SELECT * FROM user WHERE email='${email}'`)

        if (existingUser.length === 0)
            return res.status(400).json({ message: "User doesn't exist" });

        const accessToken = createAccessToken({ id: existingUser[0].userId });
        const url = `${CLIENT_URL}/user/reset/${accessToken}`;

        sendEmail(email, url, "Reset Your Password");

        res.json({ message: "The reset link was sent to your email. Please check your email." });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) return res.status(400).json({ message: "Password don't match." });

        const hashedPassword = await bcrypt.hash(password, 12); // create hashed password , salt : 12

        await query(`UPDATE user SET password = '${hashedPassword}' WHERE userId = ${req.user.id}`);

        res.json({ message: "Password successfully changed!" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await query(`SELECT * FROM user WHERE userId=${req.user.id}`)
        res.status(200).json(user[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = req.user;

        const { email, firstName, lastName } = req.body;

        const existingUser = await query(`SELECT * FROM user WHERE userId=${user.id}`)

        if (existingUser.length === 0) return res.status(400).json({ message: "User doesn't exist" });

        if (email) {
            const existingEmail = await query(`SELECT * FROM user WHERE email='${email}'`)
            if (existingEmail.length !== 0) {
                return res.status(400).json({ message: "Email already registered. Please select different Email" });
            }

            await query(`UPDATE user SET email='${email}' WHERE userId=${user.id}`)
        }

        if (firstName) {
            await query(`UPDATE user SET firstName='${firstName}' WHERE userId=${user.id}`)
        }

        if (lastName) {
            await query(`UPDATE user SET lastName='${lastName}' WHERE userId=${user.id}`)
        }

        const result = await query(`SELECT * FROM user WHERE userId = ${user.id}`)

        res.status(200).json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const changePassword = async (req, res) => {
    const user = req.user;
    const { currentPassword, password, confirmPassword } = req.body;

    try {
        const existingUser = await query(`SELECT * FROM user WHERE userId=${user.id}`)
        if (existingUser.length === 0) return res.status(400).json({ message: "User doesn't exist" });
        const isPasswordCorrect = await bcrypt.compare(currentPassword, existingUser[0].password); // compare brcypt password with the password stored from the db
        if (!isPasswordCorrect) return res.status(400).json({ message: "Incorrect password" });
        if (password !== confirmPassword) return res.status(400).json({ message: "Password don't match." });
        
        const hashedPassword = await bcrypt.hash(password, 12); // create hashed password , salt : 12
        await query(`UPDATE user SET password='${hashedPassword}' WHERE userId=${user.id}`)
        res.status(200).json({ message: "Successfully change password"});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN, { expiresIn: '30m' })
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '30m' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: '30m' })
}