import React, { useState } from 'react'
import { Typography, Paper, TextField, Button } from '@material-ui/core'
import { sendResetPasswordLink } from '../../actions/user';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        sendResetPasswordLink(email).then(res => {
            res.status === 200? setMessage(res.data.message) : setError(res.data.message)
        });
    }
    return (
        <Paper style={{ padding: '20px', height: 'fitContent', width: '350px', margin: 'auto', marginTop: '30px' }}>
            <Typography>Please enter your email to receive password reset link</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    variant="outlined"
                    style={{ marginTop: '30px' }}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {message? <Typography variant='body1' style={{color: 'green', paddingTop: '15px'}}>{message}</Typography>: null}
                {error? <Typography variant='body1' style={{color: 'red', paddingTop: '15px'}}>{error}</Typography>: null}
                <Button type='submit' style={{ marginTop: '20px' }} fullWidth variant='contained' color='primary'>Submit</Button>
            </form>
        </Paper>
    )
}

export default ForgotPassword
