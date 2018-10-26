import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Tooltip, { ClickAwayListener } from 'material-ui/Tooltip';
import { withRouter } from 'react-router-dom';

import './AppHeader.css';
import Menu from '../Menu/Menu';
import Auth from '../../modules/Auth';

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
    this.loginPush = this.loginPush.bind(this);
    this.handleTooltipClose = this.handleTooltipClose.bind(this);
    this.handleTooltipOpen = this.handleTooltipOpen.bind(this);

    this.state = {
      left: false,
      open: false
    };
  }

  handleTooltipClose = () => {
    this.setState({ open: false });
  };

  handleTooltipOpen = () => {
    this.setState({ open: true });
  };

  loginPush() {
    this.props.history.push('/login');
  }

  logoutUser() {
    const token = 'mjml-jwt';

    localStorage.removeItem(token);
    window.location.href = '/';
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  render() {
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
      }
    };

    return (
      <div style={styles.root}>
        <AppBar position="static">
          <Toolbar>
            {Auth.isUserAuthenticated() ? (
              <div>
                <Button
                  style={styles.menuButton}
                  color="inherit"
                  onClick={this.toggleDrawer('left', true)}
                >
                  Menu
                </Button>
                <Menu
                  open={this.state.left}
                  close={this.toggleDrawer('left', false)}
                />
              </div>
            ) : (
              <div />
            )}

            <Typography variant="title" color="inherit" style={styles.flex}>
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
              <Button color="inherit" onClick={this.logoutUser}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" onClick={this.loginPush}>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(AppHeader);
