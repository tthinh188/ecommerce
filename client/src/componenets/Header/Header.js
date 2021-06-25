import React, { useState, useEffect } from 'react';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { AppBar, Toolbar, IconButton, Badge, Typography, Avatar, Button } from '@material-ui/core';
import useStyles from './styles';
import logo from '../../assets/logo.png';
import { Link, useHistory, useLocation } from 'react-router-dom';
import decode from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux';
import { getUser, userLogout } from '../../actions/user';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import './Header.css';

const Header = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const [showMenu, setShowMenu] = useState(false);
    const classes = useStyles();
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();

    const logout = () => {
        dispatch(userLogout());
        history.push('/');
    }

    useEffect(() => {
        if (user) {
            const decodedToken = decode(user.refreshToken);
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
            else {
                dispatch(getUser(user.refreshToken));
            }
        }
    }, [location, dispatch])

    const userState = useSelector(state => state.auth.authData);

    return (
        <AppBar position="static" className="appBar">
            <Toolbar className='toolbar'>
                <Typography component={Link} to="/" variant="h6" className='toolBar_left' color="inherit">
                    <img src={logo} alt="commerce.js" className={classes.image} /> ECommerce Demo
                </Typography>
                <div className='toolBar_middle'>
                    {(location.pathname !== '/signin' && location.pathname !== '/profile') && (
                        <>
                            {userState ? (
                                <div className='profile'>
                                    <Avatar className='avatar' alt={userState.user.firstName} src={userState.user.userAvatar}>{`${userState.user.firstName.charAt(0)}${userState.user.lastName.charAt(0)}`}</Avatar>
                                    <Typography onClick={() => history.push('/profile')} className='userName' variant="h6">{`${userState.user.firstName} ${userState.user.lastName}`}</Typography>
                                    <Button variant="contained" color="secondary" onClick={logout}>Logout</Button>
                                </div>
                            ) : (
                                <Button className='signinButton' component={Link} to="/signin" variant="contained" color="primary">Sign In</Button>
                            )}

                        </>
                    )}
                </div>

                <div className='toolbar_right'>
                    <div className='buttons'>
                        {userState ?
                            <IconButton component={Link} to="/cart" aria-label="Show cart items" color="inherit">
                                <Badge badgeContent={1} color="secondary">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton> : null}
                        <IconButton className='menuButton' onClick={() => setShowMenu(!showMenu)}>{showMenu ? <CloseIcon /> : <MenuIcon />}</IconButton>
                    </div>
                </div>

            </Toolbar>
            <div onClick={() => setShowMenu(!showMenu)} className={`sideMenu ${showMenu && 'show'}`}>
                <Link className='menuItem' to='/'>Home</Link>
                <Link className='menuItem' to='/profile'>Profile</Link>
                <Link className='menuItem' to='/sell'>Sell</Link>
                <Link className='menuItem' to='/order'>Order</Link>
                {userState ? <Link to='/' className='menuItem' onClick={logout}>Logout</Link> : <Link to="/signin" className='menuItem'>Login</Link>}

            </div>
        </AppBar>

        // <AppBar position="static" className={classes.appBar}>
        //     <Toolbar >
        //         <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit">
        //             <img src={logo} alt="commerce.js" className={classes.image} /> ECommerce Demo
        //             </Typography>
        //         <div className={classes.grow} />
        //         {(location.pathname !== '/signin' && location.pathname !== '/profile') && (
        //             <>
        //                 <Toolbar className={classes.toolbar}>
        //                     {userState ? (
        //                         <div className={classes.profile}>
        //                             <Avatar className={classes.purple} alt={userState.user.firstName} src={userState.user.userAvatar}>{`${userState.user.firstName.charAt(0)}${userState.user.lastName.charAt(0)}`}</Avatar>
        //                             <Typography onClick={() => history.push('/profile')} className={classes.userName} variant="h6">{`${userState.user.firstName} ${userState.user.lastName}`}</Typography>
        //                             <Button variant="contained" color="secondary" onClick={logout}>Logout</Button>
        //                         </div>
        //                     ) : (
        //                         <Button component={Link} to="/signin" variant="contained" color="primary">Sign In</Button>
        //                     )}
        //                 </Toolbar>
        //                 <div className={classes.button}>
        //                     <IconButton component={Link} to="/cart" aria-label="Show cart items" color="inherit">
        //                         <Badge badgeContent={1} color="secondary">
        //                             <ShoppingCartIcon />
        //                         </Badge>
        //                     </IconButton>
        //                     {userState ? <IconButton onClick={() => setShowMenu(!showMenu)}><MenuIcon /></IconButton> : null}
        //                 </div>
        //             </>
        //         )}

        //     </Toolbar>
        //     <div onClick={() => setShowMenu(!showMenu)} className={`sideMenu ${showMenu && 'show'}`}>
        //         <Link className={classes.menuItem} to='/'>Home</Link>
        //         <Link className={classes.menuItem} to='/signin'>Login</Link>
        //         <Link className={classes.menuItem} to='/profile'>Profile</Link>
        //         <Link className={classes.menuItem} to='/sell'>Sell</Link>
        //         <Link className={classes.menuItem} to='/order'>Order</Link>

        //     </div>
        // </AppBar>
    )
}

export default Header
