import React, { Component } from 'react';

import CreateOrganizationView from '../Components/Organization/CreateOrganization';

class CreateOrganization extends Component {
  render() {
    return (
      <div style={{ marginTop: 32 }}>
        <CreateOrganizationView />
      </div>
    );
  }
}

export default CreateOrganization;
