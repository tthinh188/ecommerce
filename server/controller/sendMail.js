import nodemailer from 'nodemailer';
import { google } from 'googleapis';
const { OAuth2 } = google.auth;
const OATH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const {
    MAIL_CLIENT_ID,
    MAIL_CLIENT_SECRET,
    MAIL_REFRESH,
    SENDER_EMAIL,
} = process.env

const oauth2Client = new OAuth2(MAIL_CLIENT_ID, MAIL_CLIENT_SECRET, MAIL_REFRESH, OATH_PLAYGROUND)

export const sendEmail = (to, url, txt) => {
    oauth2Client.setCredentials({
        refresh_token: MAIL_REFRESH
    })

    const accessToken = oauth2Client.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL,
            clientId: MAIL_CLIENT_ID,
            clientSecret: MAIL_CLIENT_SECRET,
            refreshToken: MAIL_REFRESH,
            accessToken
        }
    })

    const mailOptions = {
        from : SENDER_EMAIL,
        to: to,
        subject: txt,
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Thinh Phan's Demo'.</h2>
                <p>Congratulations! You're almost set to start using Ecommerce.
                    Click the button below to validate your email address.
                </p>
                
                <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
            
                <p>If the button doesn't work for any reason, you can also click on the link below:</p>
            
                <div>${url}</div>
            </div>
        `
    }

    smtpTransport.sendMail(mailOptions, (err, data) => {
        if(err) return err;
        return data;
    });
}
