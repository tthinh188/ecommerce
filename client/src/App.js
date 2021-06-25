import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './componenets/Header/Header';
import Login from './componenets/Login/Login';
import Home from './componenets/Home/Home';
import Activation from './componenets/Activation/Activation';
import Profile from './componenets/Profile/Profile';
import ForgotPassword from './componenets/ForgotPassword/ForgotPassword';
import ResetPassword from './componenets/ResetPassword/ResetPassword';


function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route exact path='/signin'>
            <Login />
          </Route>

          <Route exact path='/profile'>
            <Profile />
          </Route>

          <Route exact path='/forgot_password'>
            <ForgotPassword />
          </Route>

          <Route exact path='/user/reset/:reset_token'>
            <ResetPassword />
          </Route>

          <Route exact path='/user/activate/:activation_token'>
            <Activation />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
