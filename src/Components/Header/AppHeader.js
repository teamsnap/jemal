import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import './AppHeader.css';
import Menu from '../Menu/Menu';
import Auth from '../../modules/Auth';

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  link: {
    textDecoration: 'none',
    color: 'white'
  }
};

const AppHeader = () => {
  const [open, setOpen] = useState(false);

  const logoutUser = () => {
    const token = 'mjml-jwt';

    localStorage.removeItem(token);
    window.location.href = '/';
  };

  return (
    <div style={styles.root}>
      <AppBar position="static">
        <Toolbar>
          {Auth.isUserAuthenticated() ? (
            <>
              <Button
                style={styles.menuButton}
                color="inherit"
                onClick={() => setOpen(true)}
              >
                Menu
              </Button>
              <Menu open={open} close={() => setOpen(false)} />
            </>
          ) : null}
          <Typography variant="h6" color="inherit" style={styles.flex}>
            <Tooltip
              disableFocusListener
              title="Jolly Email Management Application Laboratory"
            >
              <Link to="/" className="AppHeaderLogo">
                J.E.M.A.L
              </Link>
            </Tooltip>
          </Typography>
          {Auth.isUserAuthenticated() ? (
            <Button color="inherit" onClick={logoutUser}>
              Logout
            </Button>
          ) : (
            <Button color="inherit">
              <Link to="/login" style={styles.link}>
                Login
              </Link>
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppHeader;
