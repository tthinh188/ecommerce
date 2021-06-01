import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { activation, resendActivationEmail } from '../../actions/user'
import { Typography, Paper, Button } from '@material-ui/core';
import useStyles from './styles';
import Input from '../Login/Input';

const Activation = () => {
    const [email, setEmail] = useState('');
    const classes = useStyles();
    const dispatch = useDispatch();
    const { activation_token } = useParams();
    const [sent, setSent] = useState(false);

    const [userEmail, setUserEmail] = useState('');

    const handleChange = (e) => {
        setUserEmail(e.target.value);
    }

    const handleResendEmail = (e) => {
        e.preventDefault();
        console.log(userEmail);
        dispatch(resendActivationEmail(userEmail));
        setSent(true);
    }

    useEffect(() => {
        dispatch(activation(activation_token)).then(data => setEmail(data.email));
    }, [])
    return (
        <Paper className={classes.paper}>
            { email ?
                (<Typography variant='h5' style={{ padding: '20px' }} >Your account <span style={{ color: 'blue' }}>{email}</span> has been activated</Typography>) :

                (<Typography variant='h5' style={{ padding: '20px' }} >{sent ? `The activation link has been sent to your email` : 'Activation link has been expired, please enter your email to receive the activation link.'}{sent ? null :
                    <form style={{ marginTop: '20px' }} onSubmit={handleResendEmail}>
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Button style={{ marginTop: '20px' }} variant='contained' color='primary' type='submit'>Submit</Button>
                    </form>}
                </Typography>)

            }
        </Paper>
    )
}

export default Activation
