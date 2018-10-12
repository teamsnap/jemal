import React, { Component } from 'react';

import CreateEmailPartialView from '../Components/Email/CreateEmailPartial';

class CreateEmailPartial extends Component {
  render() {
    return (
      <div style={{ marginTop: 32 }}>
        <CreateEmailPartialView />
      </div>
    );
  }
}

export default CreateEmailPartial;
