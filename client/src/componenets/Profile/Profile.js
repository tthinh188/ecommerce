import React, { useState, useEffect } from 'react'
import { Button, Grow, Grid, Avatar, Typography, Container, Paper, IconButton } from '@material-ui/core';
import useStyles from './styles';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/CloseOutlined'
import Input from '../Login/Input'
import { getUser, updateUser } from '../../actions/user';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

const initialState = { firstName: '', lastName: '', email: '' };

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('profile'));

    const classes = useStyles();
    const [formData, setFormData] = useState(initialState)
    const [editEmail, setEditEmail] = useState(false);
    const [editName, setEditName] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const userState = useSelector(state => state.auth.authData);

    const hideEmail = (email) => (`${email.charAt(0)}...${email.slice(email.indexOf('@') - 1, email.length)}`)

    const updateProfile = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (formData.firstName || formData.email) {
            dispatch(updateUser(user?.refreshToken, formData)).then(res => {
                res.status === 200 ? setMessage("Successfully update profile") : setError(res.data.message)
            })
            setFormData(initialState);
        }
    }

    const handleShowEditName = () => {
        setEditName(!editName)
        setFormData({ ...formData, firstName: '', lastName: '' })
    }

    const handleShowEditEmail = () => {
        setEditEmail(!editEmail);
        setFormData({ ...formData, email: '' })
    }

    useEffect(() => {
        dispatch(getUser(user?.refreshToken));
    }, [dispatch])

    if (userState) {
        return (
            <Grow in>
                <Container className={classes.profile} component='main' maxWidth='xs'>
                    <Paper className={classes.paper} elevation={3}>
                        <form onSubmit={updateProfile}>
                            <Avatar className={classes.avatar} alt={userState.user.firstName} src={userState.user.userAvatar}>{`${userState.user.firstName.charAt(0)}${userState.user.lastName.charAt(0)}`}</Avatar>
                            <Typography className={classes.profileInfo} variant='h5'>{userState.user.firstName} {userState.user.lastName} <IconButton onClick={handleShowEditName}>{editName ? <CloseIcon /> : <EditIcon />}</IconButton></Typography>
                            <Grid container spacing={2}>
                                {editName ? (<>
                                    <Input value={formData.firstName} handleChange={(e) => setFormData({ ...formData, firstName: e.target.value })} name="firstName" label="First Name" autoFocus half />
                                    <Input value={formData.lastName} handleChange={(e) => setFormData({ ...formData, lastName: e.target.value })} name="lastName" label="Last Name" half /></>) : null}
                            </Grid>


                            <Typography className={classes.profileInfo} variant='body1'>{hideEmail(userState.user.email)}<IconButton onClick={handleShowEditEmail}>{editEmail ? <CloseIcon /> : <EditIcon />}</IconButton></Typography>
                            {editEmail ? <Input name="email" label="Email Address" type="email" value={formData.email} handleChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                : null}
                            {message ? <Typography variant='body1' style={{ color: 'green', paddingTop: '15px' }}>{message}</Typography> : null}
                            {error ? <Typography variant='body1' style={{ color: 'red', paddingTop: '15px' }}>{error}</Typography> : null}

                            <Button type='submit' style={{ width: '100%', marginTop: '20px' }} variant='contained' color='primary'>Update</Button>
                        </form>
                        <Button type='submit' style={{ width: '100%', marginTop: '20px' }} variant='contained' color='secondary'>Change Password</Button>
                    </Paper>
                </Container>
            </Grow>

        )
    }
    return <div style={{ height: "90vh", textAlign: 'center' }}><CircularProgress style={{ marginTop: "50px" }} /></div>
}

export default Profile
