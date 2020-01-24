import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import flowright from 'lodash.flowright';

import OrgSetup from '../Components/Dashboard/OrgSetup';
import MainDashboard from '../Components/Dashboard/MainDashboard';
import Loading from '../Components/Loading/Loading';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      success: '',
      errorMessage: ''
    };
    // this.handleChange = this.handleChange.bind(this);
  }

  render() {
    const styles = {
      root: {
        flexGrow: 1,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 60
      },
      heading: {
        marginBottom: 20
      },
      button: {
        marginRight: 20,
        textDecoration: 'none'
      },
      flexEnd: {
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-end'
      },
      paper: {
        padding: 20
      }
    };

    const { getAllEmails, currentUser } = this.props;

    if (getAllEmails.loading) return <Loading />;
    if (currentUser.loading) return <Loading />;

    const user = currentUser && currentUser.currentUser;
    const emails = getAllEmails && getAllEmails.getAllEmails;

    return (
      <div style={styles.root}>
        {user && !user.organizationId ? (
          <OrgSetup user={user} />
        ) : (
          <MainDashboard user={user} emails={emails} />
        )}
      </div>
    );
  }
}

const currentUser = gql`
  query currentUser {
    currentUser {
      _id
      email
      firstname
      organizationId
    }
  }
`;

const getEmailsCount = gql`
  query getEmailsCount($_id: String!) {
    getEmailsCount(_id: $_id) {
      count
    }
  }
`;

const getAllEmails = gql`
  query getAllEmails($_id: String!, $offset: Int, $limit: Int) {
    getAllEmails(_id: $_id, offset: $offset, limit: $limit) {
      title
      isDraft
      hasBeenSent
      isApproved
      favorited
      updatedAt
      createdAt
      updatedById
      createdById
      screenshot
      _id
    }
  }
`;

export default flowright(
  graphql(currentUser, {
    name: 'currentUser'
  }),
  graphql(getAllEmails, {
    name: 'getAllEmails',
    options: ownProps => ({
      variables: {
        _id:
          !ownProps.currentUser.loading &&
          ownProps.currentUser.currentUser &&
          ownProps.currentUser.currentUser.organizationId,
        offset: 0,
        limit: 6
      },
      forceRefetch: true
    })
  }),
  graphql(getEmailsCount, {
    name: 'getEmailsCount',
    options: ownProps => ({
      variables: {
        _id:
          !ownProps.currentUser.loading &&
          ownProps.currentUser.currentUser &&
          ownProps.currentUser.currentUser.organizationId
      },
      forceRefetch: true
    })
  })
)(withApollo(Dashboard));
