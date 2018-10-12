import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql, compose } from 'react-apollo';
import { NavLink, Link } from 'react-router-dom';

import './Menu.css';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';

class Menu extends Component {
  state = {
    left: false
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  logoutUser() {
    const token = 'mjml-jwt';

    localStorage.removeItem(token);
    window.location.href = '/';
  }

  render() {
    const styles = {
      list: {
        width: '100%',
        marginTop: 20,
        marginBottom: 20
      },
      logo: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20
      },
      listItem: {
        fontFamily: 'sans-serif',
        textDecoration: 'none',
        paddingTop: 0,
        paddingBottom: 0
      },
      fullList: {
        width: 'auto'
      }
    };

    if (this.props.loading) return null;
    const user =
      this.props.currentUser.currentUser && this.props.currentUser.currentUser;
    return (
      <div>
        <Drawer open={this.props.open} onClose={this.props.close}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.props.close}
            onKeyDown={this.props.close}
          >
            <Link to="/">
              {user && user.organization ? (
                <img
                  style={styles.logo}
                  src={user && user.organization.logoUrl}
                  alt={user && user.organization.name}
                />
              ) : null}
            </Link>
            <div style={styles.list}>
              <List className="ListItem" style={styles.listItem}>
                <NavLink to="/">Dashboard</NavLink>
              </List>
              <Divider />
              <List className="ListItem" style={styles.listItem}>
                <NavLink to="/email/create">New email</NavLink>
              </List>
              <List className="ListItem" style={styles.listItem}>
                <NavLink to="/email/view/page/1">View all emails</NavLink>
              </List>
              <List className="ListItem" style={styles.listItem}>
                <NavLink to="/email/favorited/view/page/1">
                  View all favorited emails
                </NavLink>
              </List>
              <Divider />
              <List className="ListItem" style={styles.listItem}>
                <NavLink to="/email/partials/create">
                  Create email partials
                </NavLink>
              </List>
              <List className="ListItem" style={styles.listItem}>
                <NavLink to="/email/partials/view/page/1">
                  View all email partials
                </NavLink>
              </List>
              <Divider />
              {user && user.organizationId ? (
                <List className="ListItem" style={styles.listItem}>
                  <NavLink
                    to={`/organization/invite/${user && user.organizationId}`}
                  >
                    Invite to organization
                  </NavLink>
                </List>
              ) : null}
              <List className="ListItem" style={styles.listItem}>
                <NavLink to="/settings">Settings</NavLink>
              </List>
              <List className="ListItem" style={styles.listItem}>
                <Link to="#" color="inherit" onClick={this.logoutUser}>
                  Logout
                </Link>
              </List>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

const currentUser = gql`
  query currentUser {
    currentUser {
      _id
      organizationId
      organization {
        name
        logoUrl
      }
    }
  }
`;

export default compose(
  graphql(currentUser, {
    name: 'currentUser'
  })
)(withApollo(Menu));
