import React, { Component } from 'react';
import LoginForm from '../Components/Authentication/LoginForm';

class Login extends Component {
  render() {
    return (
      <div className="Login" style={{ padding: 20 }}>
        <div>
          <LoginForm />
        </div>
      </div>
    );
  }
}

export default Login;
