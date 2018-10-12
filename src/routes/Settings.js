import React, { Component } from 'react';
import SettingsView from '../Components/Settings/Settings';

class Settings extends Component {
  render() {
    return (
      <div className="Signup" style={{ padding: 20 }}>
        <div>
          <SettingsView />
        </div>
      </div>
    );
  }
}

export default Settings;
