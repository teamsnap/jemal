import React, { Component } from 'react';
import SignupForm from '../Components/Authentication/SignupForm';

class Signup extends Component {
  render() {
    return (
      <div className="Signup" style={{ padding: 20 }}>
        <div>
          <SignupForm />
        </div>
      </div>
    );
  }
}

export default Signup;
