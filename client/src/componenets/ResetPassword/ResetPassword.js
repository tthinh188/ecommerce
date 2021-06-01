import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

import { Paper, Typography, Button, Grid, Container } from '@material-ui/core';
import useStyles from './styles';
import Input from '../Login/Input'
import { resetPassword } from '../../actions/user';

const initialState = { password: '', confirmPassword: '' };

const ResetPassword = () => {
    const { reset_token } = useParams();
    const classes = useStyles();
    const [formData, setFormData] = useState(initialState)
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleShowPassword = () => setShowPassword(showPassword => !showPassword);


    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        if(formData.password.length < 6 || formData.confirmPassword.length < 6) {
            setError('Password required at least 6 character')
        }
        else 
        resetPassword(reset_token, formData).then(res => {
            res.status === 200 ? setMessage(res.data.message) : setError(res.data.message)
        });
    }
    return (
        <Container className={classes.container} component='main' maxWidth='xs'>
            <Paper className={classes.paper} elevation={3}>
                <Typography variant='h4' className={classes.header}>Reset Password</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid className={classes.grid} container spacing={2}>
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" />
                    </Grid>
                    {message ? <Typography variant='body1' style={{ color: 'green', paddingTop: '15px' }}>{message}</Typography> : null}
                    {error ? <Typography variant='body1' style={{ color: 'red', paddingTop: '15px' }}>{error}</Typography> : null}

                    <Button type='submit' className={classes.button} fullWidth variant='contained' color="primary">Change Password</Button>

                </form>
            </Paper>
        </Container>
    )
}

export default ResetPassword
