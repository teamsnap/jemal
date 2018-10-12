import React, { Component } from 'react';
import ForgotForm from '../Components/Authentication/ForgotForm';

class Forgot extends Component {
  render() {
    return (
      <div className="Forgot" style={{ padding: 20 }}>
        <div>
          <ForgotForm />
        </div>
      </div>
    );
  }
}

export default Forgot;
