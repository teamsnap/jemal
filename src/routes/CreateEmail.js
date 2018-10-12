import React, { Component } from 'react';

import CreateEmailView from '../Components/Email/CreateEmail';

class CreateEmail extends Component {
  render() {
    return (
      <div style={{ marginTop: 32 }}>
        <CreateEmailView />
      </div>
    );
  }
}

export default CreateEmail;
