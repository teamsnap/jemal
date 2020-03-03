import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { NavLink, Link } from 'react-router-dom';

import './Menu.css';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

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

const CURRENT_USER = gql`
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

const Menu = ({ close, open }) => {
  const { data, loading } = useQuery(CURRENT_USER);

  const logoutUser = () => {
    const token = 'mjml-jwt';

    localStorage.removeItem(token);
    window.location.href = '/';
  };

  if (loading) return null;

  return (
    <Drawer open={open} onClose={close}>
      <div tabIndex={0} role="button" onClick={close} onKeyDown={close}>
        <Link to="/">
          {data && data.currentUser.organization ? (
            <img
              style={styles.logo}
              src={data.currentUser.organization.logoUrl}
              alt={data.currentUser.organization.name}
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
            <NavLink to="/email/partials/create">Create email partials</NavLink>
          </List>
          <List className="ListItem" style={styles.listItem}>
            <NavLink to="/email/partials/view/page/1">
              View all email partials
            </NavLink>
          </List>
          <Divider />
          {data && data.currentUser.organizationId ? (
            <List className="ListItem" style={styles.listItem}>
              <NavLink
                to={`/organization/invite/${data &&
                  data.currentUser.organizationId}`}
              >
                Invite to organization
              </NavLink>
            </List>
          ) : null}
          <List className="ListItem" style={styles.listItem}>
            <NavLink to="/settings">Settings</NavLink>
          </List>
          <List className="ListItem" style={styles.listItem}>
            <Link to="#" color="inherit" onClick={logoutUser}>
              Logout
            </Link>
          </List>
        </div>
      </div>
    </Drawer>
  );
};

export default Menu;
