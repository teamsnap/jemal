import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery, useMutation, useApolloClient } from 'react-apollo';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const styles = {
  card: {
    maxWidth: 400,
    margin: '0 auto'
  },
  formControl: {
    minWidth: 120
  },
  formControlPad: {
    marginTop: 20
  }
};

const ACCEPT_TO_ORGANIZATION = gql`
  mutation acceptToOrganization($email: String!, $organizationId: String!) {
    acceptToOrganization(email: $email, organizationId: $organizationId) {
      email
    }
  }
`;

const GET_ORGANIZATION = gql`
  query currentOrganization($_id: String!) {
    currentOrganization(_id: $_id) {
      name
      logoUrl
    }
  }
`;

const CURRENT_USER = gql`
  query currentUser {
    currentUser {
      _id
      email
    }
  }
`;

const AcceptToOrganizationView = () => {
  const [value, setValue] = useState({
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccces] = useState('');
  const history = useHistory();
  const client = useApolloClient();
  const { id } = useParams();
  const { data: data_user, loading: loading_user } = useQuery(CURRENT_USER);
  const {
    data: getOrganizationData,
    loading: getOrganizationLoading
  } = useQuery(GET_ORGANIZATION, {
    variables: {
      _id: id
    }
  });
  const [
    acceptToOrganization,
    {
      data: acceptToOrganizationData,
      loading: acceptToOrganizationLoading,
      error: acceptToOrganizationError
    }
  ] = useMutation(ACCEPT_TO_ORGANIZATION);

  const handleAcceptToOrganization = () => {
    const { email } = value;
    const organizationId = id;

    if (!email) {
      setError('Form must not be empty');
      return;
    }

    acceptToOrganization({
      variables: {
        email,
        organizationId
      }
    });

    if (acceptToOrganizationError) {
      setError(acceptToOrganizationError.message.split(':')[1]);
      return;
    }
  };

  const handleChange = e =>
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });

  const goBack = () => history.goBack();

  useEffect(() => {
    if (!loading_user && data_user) {
      setValue(v => ({ ...v, email: data_user.currentUser.email }));
    }
  }, [data_user, loading_user]);

  useEffect(() => {
    if (!acceptToOrganizationLoading && acceptToOrganizationData) {
      setSuccces('Great! You are now apart of the organization now!');
      setError('');
      client.resetStore();
      window.location = '/';
    }
  }, [acceptToOrganizationData, acceptToOrganizationLoading]);

  return (
    <div>
      <Card style={styles.card}>
        <CardContent>
          <form action="/">
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
            <img
              src={
                !getOrganizationLoading &&
                getOrganizationData.currentOrganization &&
                getOrganizationData.currentOrganization.logoUrl
              }
              alt="Organization logo"
            />
            <Typography variant="h5">
              You have been Invited to{' '}
              {!getOrganizationLoading &&
                getOrganizationData.currentOrganization &&
                getOrganizationData.currentOrganization.name}
            </Typography>
            <div style={styles.formControlPad}>
              <TextField
                name="email"
                placeholder="email"
                fullWidth
                type="email"
                value={value.email}
                onChange={handleChange}
              />
            </div>
          </form>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAcceptToOrganization}
          >
            Accept
          </Button>
          <Button variant="contained" size="small" onClick={goBack}>
            Cancel
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default AcceptToOrganizationView;
