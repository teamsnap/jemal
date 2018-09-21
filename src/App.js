import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'

import Auth from './modules/Auth';
import AppHeader from './Components/Header/AppHeader';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Dashboard from './routes/Dashboard';
import CreateEmail from './routes/CreateEmail';
import CreateEmailPartial from './routes/CreateEmailPartial';
import EditEmail from './routes/EditEmail';
import ViewAllPartials from './routes/ViewAllPartials';
import ViewAllEmails from './routes/ViewAllEmails';
import ViewAllFavoritedEmails from './routes/ViewAllFavoritedEmails';
import EmailEditorOnly from './routes/EditorOnly';
import CreateOrganization from './routes/CreateOrganization';
import EditOrganization from './routes/EditOrganization';
import InviteToOrganization from './routes/InviteToOrganization';
import AcceptToOrganization from './routes/AcceptToOrganization';
import Settings from './routes/Settings';
import Forgot from './routes/Forgot';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Component {...props} {...rest} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const LoggedOutRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    ) : (
      <Component {...props} {...rest} />
    )
  )}/>
)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false
    }
  };

  componentDidMount() {
    // check if user is logged in on refresh
    this.toggleAuthenticateStatus()
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }

  render() {
    return (
        <Router>
          <div>
            {this.state.authenticated ? (
              <AppHeader authenticated={() => this.toggleAuthenticateStatus()}/>
            ) : (
              <AppHeader authenticated={() => this.toggleAuthenticateStatus()}/>
            )}
              <PrivateRoute exact path="/" component={Dashboard} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
              <PrivateRoute match path="/email/create" component={CreateEmail} />
              <PrivateRoute match path="/email/edit/:id" component={EditEmail} />
              <PrivateRoute match path="/email/partials/create" component={CreateEmailPartial} />
              <PrivateRoute match path="/email/partials/view/page/:page" exact component={ViewAllPartials} />
              <PrivateRoute match path="/email/view/page/:page" exact component={ViewAllEmails} />
              <PrivateRoute match path="/email/favorited/view/page/:page" exact component={ViewAllFavoritedEmails} />
              <PrivateRoute match path="/email/partials/edit/:id" component={EmailEditorOnly} />
              <PrivateRoute match path="/organization/create" component={CreateOrganization} />
              <PrivateRoute match path="/organization/invite/:id" component={InviteToOrganization} />
              <PrivateRoute match path="/organization/accept/:id" component={AcceptToOrganization} />
              <PrivateRoute match path="/organization/edit/:id" component={EditOrganization} />
              <PrivateRoute path="/settings" component={Settings}/>
              <LoggedOutRoute path="/login" component={Login} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
              <LoggedOutRoute path="/signup" component={Signup}/>
              <LoggedOutRoute path="/forgot" exact component={Forgot}/>
              <LoggedOutRoute path="/forgot/:token" component={Forgot}/>
          </div>
        </Router>
    );
  }
}

export default App;
