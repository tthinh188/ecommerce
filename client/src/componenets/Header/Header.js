import React, { useEffect } from 'react';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { AppBar, Toolbar, IconButton, Badge, Typography, Avatar, Button } from '@material-ui/core';
import useStyles from './styles';
import logo from '../../assets/logo.png';
import { Link, useHistory, useLocation } from 'react-router-dom';
import decode from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux';
import { getUser, userLogout } from '../../actions/user';

const Header = () => {
    const user = JSON.parse(localStorage.getItem('profile'));

    const classes = useStyles();
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();

    const logout = () => {
        history.push('/');
        dispatch(userLogout());
    }

    useEffect(() => {
        if (user) {
            const decodedToken = decode(user?.refreshToken);
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
            else {
                dispatch(getUser(user.refreshToken));
            }
        }
    }, [location, dispatch])

    const userState = useSelector(state => state.auth.authData);
    
    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar >
                <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit">
                    <img src={logo} alt="commerce.js" className={classes.image} /> ECommerce Demo
                    </Typography>
                <div className={classes.grow} />
                {location.pathname === '/' && (
                    <>
                        <Toolbar className={classes.toolbar}>
                            {userState ? (
                                <div className={classes.profile}>
                                    <Avatar className={classes.purple} alt={userState.user.firstName} src={userState.user.userAvatar}>{`${userState.user.firstName.charAt(0)}${userState.user.lastName.charAt(0)}`}</Avatar>
                                    <Typography onClick={() => history.push('/profile')} className={classes.userName} variant="h6">{`${userState.user.firstName} ${userState.user.lastName}`}</Typography>
                                    <Button variant="contained" color="secondary" onClick={logout}>Logout</Button>
                                </div>
                            ) : (
                                <Button component={Link} to="/signin" variant="contained" color="primary">Sign In</Button>
                            )}
                        </Toolbar>
                        <div className={classes.button}>
                            <IconButton component={Link} to="/cart" aria-label="Show cart items" color="inherit">
                                <Badge badgeContent={1} color="secondary">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        </div>
                    </>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Header
