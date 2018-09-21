import React, { Component } from "react";

import EditOrganizationView from '../Components/Organization/EditOrganization'

class EditOrganization extends Component {
    render() {
        return (
            <div style={{ marginTop: 32 }}>
                <EditOrganizationView />
            </div>
        );
    }
}

export default EditOrganization;
