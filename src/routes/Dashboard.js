import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

import OrgSetup from '../Components/Dashboard/OrgSetup';
import MainDashboard from '../Components/Dashboard/MainDashboard';
import Loading from '../Components/Loading/Loading';

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

const CURRENT_USER = gql`
  query currentUser {
    currentUser {
      _id
      email
      firstname
      organizationId
    }
  }
`;

const GET_ALL_EMAILS = gql`
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
      _id
    }
  }
`;

const DUPLICATE_EMAIL = gql`
  mutation duplicateEmail($_id: String!) {
    duplicateEmail(_id: $_id) {
      title
      isDraft
      hasBeenSent
      isApproved
      favorited
      updatedAt
      createdAt
      updatedById
      createdById
      _id
    }
  }
`;

const Dashboard = ({ history }) => {
  const { data: data_user, loading: loading_user } = useQuery(CURRENT_USER);
  const { data: data_emails, loading: loading_emails } = useQuery(
    GET_ALL_EMAILS,
    {
      variables: {
        skip: !data_user,
        _id: data_user && data_user.currentUser.organizationId,
        offset: 0,
        limit: 6
      }
    }
  );
  const [duplicateEmail] = useMutation(DUPLICATE_EMAIL, {
    update(cache, { data: { duplicateEmail } }) {
      const { getAllEmails } = cache.readQuery({
        query: GET_ALL_EMAILS,
        variables: {
          skip: !data_user,
          _id: data_user && data_user.currentUser.organizationId,
          offset: 0,
          limit: 6
        }
      });

      getAllEmails.pop();

      cache.writeQuery({
        query: GET_ALL_EMAILS,
        variables: {
          skip: !data_user,
          _id: data_user && data_user.currentUser.organizationId,
          offset: 0,
          limit: 6
        },
        data: { getAllEmails: getAllEmails.unshift(duplicateEmail) }
      });

      history.push(`/email/edit/${duplicateEmail._id}`);
    }
  });

  if (loading_user || loading_emails) return <Loading />;

  return (
    <div style={styles.root}>
      {data_user && !data_user.currentUser.organizationId ? (
        <OrgSetup user={data_user.currentUser} />
      ) : (
        <MainDashboard
          user={data_user.currentUser}
          emails={data_emails.getAllEmails}
          history={history}
          duplicateEmail={duplicateEmail}
        />
      )}
    </div>
  );
};

export default Dashboard;
