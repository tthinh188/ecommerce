import React, { useState, useEffect } from 'react'
import { Button, Grow, Grid, Avatar, Typography, Container, Paper, IconButton } from '@material-ui/core';
import useStyles from './styles';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/CloseOutlined'
import Input from '../Login/Input'
import { getUser, updateUser, changePassword } from '../../actions/user';
import { uploadAvatar } from '../../actions/upload';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

const initialState = { firstName: '', lastName: '', email: '' };
const initialPasswordForm = { currentPassword: '', password: '', confirmPassword: '' }

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('profile'));

    const classes = useStyles();
    const [userData, setUserData] = useState(initialState)
    const [formChangePassword, setFormChangePassword] = useState(initialPasswordForm);
    const [editEmail, setEditEmail] = useState(false);
    const [editName, setEditName] = useState(false);
    const [changePasswordMode, setChangePasswordMode] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [file, setFile] = useState(null);

    const dispatch = useDispatch();
    const userState = useSelector(state => state.auth.authData);

    const handleShowPassword = () => setShowPassword(showPassword => !showPassword);

    const hideEmail = (email) => (`${email.charAt(0)}...${email.slice(email.indexOf('@') - 1, email.length)}`)

    const updateProfile = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        dispatch(updateUser(user?.refreshToken, userData))
        if (userData.firstName || userData.email) {
            dispatch(updateUser(user?.refreshToken, userData)).then(res => {
                res.status === 200 ? setMessage("Successfully update profile") : setError(res.data.message)
            })
            setUserData(initialState);
        }
        if (file) {
            let formData = new FormData();
            formData.append('file', file)
            dispatch(uploadAvatar(user?.refreshToken, formData))
        }
    }

    const handleShowEditName = () => {
        setEditName(!editName)
        setUserData({ ...userData, firstName: '', lastName: '' })
    }

    const handleShowEditEmail = () => {
        setEditEmail(!editEmail);
        setUserData({ ...userData, email: '' })
    }

    useEffect(() => {
        dispatch(getUser(user?.refreshToken));
    }, [dispatch, user?.refreshToken])

    const handleChange = (e) => {
        setFormChangePassword({ ...formChangePassword, [e.target.name]: e.target.value });
    }

    const handleChangePassword = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        changePassword(user.refreshToken, formChangePassword).then(res => {
            res.status === 200 ? setMessage(res.data.message) : setError(res.data.message)
        })
    }

    if (userState) {
        return (
            <Grow in>
                <Container className={classes.profile} component='main' maxWidth='xs'>
                    <Paper className={classes.paper} elevation={3}>
                        {changePasswordMode ?
                            (
                                <>
                                    <form onSubmit={handleChangePassword}>
                                        <Grid container spacing={2}>
                                            <Input name="currentPassword" label="Current Password" handleChange={handleChange} type="password" />
                                            <Input name="password" label="New Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                                            <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" />

                                        </Grid>
                                        {message ? <Typography variant='body1' style={{ color: 'green', paddingTop: '15px' }}>{message}</Typography> : null}
                                        {error ? <Typography variant='body1' style={{ color: 'red', paddingTop: '15px' }}>{error}</Typography> : null}

                                        <Button type='submit' style={{ width: '100%', marginTop: '20px' }} variant='contained' color='primary'>submit</Button>
                                    </form>

                                    <Button type='submit' style={{ width: '100%', marginTop: '20px' }} variant='contained' color='secondary' onClick={() => setChangePasswordMode(false)}>Update information</Button>
                                </>
                            )
                            :
                            (
                                <>
                                    <form onSubmit={updateProfile}>
                                        <Avatar className={classes.avatar} alt={userState.user.firstName} src={userState.user.userAvatar}>{`${userState.user.firstName.charAt(0)}${userState.user.lastName.charAt(0)}`}</Avatar>
                                        <p>
                                            Change Avatar:
                                            <br />
                                            <input accept="image/png, image/gif, image/jpeg" type="file" name="file" id="file_up" onChange={(e) => setFile(e.target.files[0])} />
                                        </p>
                                        <Typography className={classes.profileInfo} variant='h5'>{userState.user.firstName} {userState.user.lastName} <IconButton onClick={handleShowEditName}>{editName ? <CloseIcon /> : <EditIcon />}</IconButton></Typography>
                                        <Grid container spacing={2}>
                                            {editName ? (<>
                                                <Input value={userData.firstName} handleChange={(e) => setUserData({ ...userData, firstName: e.target.value })} name="firstName" label="First Name" autoFocus half />
                                                <Input value={userData.lastName} handleChange={(e) => setUserData({ ...userData, lastName: e.target.value })} name="lastName" label="Last Name" half /></>) : null}
                                        </Grid>


                                        <Typography className={classes.profileInfo} variant='body1'>{hideEmail(userState.user.email)}<IconButton onClick={handleShowEditEmail}>{editEmail ? <CloseIcon /> : <EditIcon />}</IconButton></Typography>
                                        {editEmail ? <Input name="email" label="Email Address" type="email" value={userData.email} handleChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                                            : null}
                                        {message ? <Typography variant='body1' style={{ color: 'green', paddingTop: '15px' }}>{message}</Typography> : null}
                                        {error ? <Typography variant='body1' style={{ color: 'red', paddingTop: '15px' }}>{error}</Typography> : null}

                                        <Button type='submit' style={{ width: '100%', marginTop: '20px' }} variant='contained' color='primary'>Update</Button>
                                    </form>
                                    <Button type='submit' style={{ width: '100%', marginTop: '20px' }} variant='contained' color='secondary' onClick={() => setChangePasswordMode(true)}>Change Password</Button>
                                </>
                            )}
                    </Paper>
                </Container>
            </Grow >

        )
    }
    return <div style={{ height: "90vh", textAlign: 'center' }}><CircularProgress style={{ marginTop: "50px" }} /></div>
}

export default Profile
