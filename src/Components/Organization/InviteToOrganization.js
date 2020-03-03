import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo';

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

const INVITE_TO_ORGANIZATON = gql`
  mutation inviteToOrganization($email: String!) {
    inviteToOrganization(email: $email) {
      email
    }
  }
`;

const InviteToOrganizationView = () => {
  const [value, setValue] = useState({
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccces] = useState('');
  const history = useHistory();

  const [
    inviteToOrganization,
    {
      data: inviteToOrganizationData,
      loading: inviteToOrganizationLoading,
      error: inviteToOrganizationError
    }
  ] = useMutation(INVITE_TO_ORGANIZATON);

  const handleInviteToOrganization = () => {
    const { email } = value;

    if (!email) {
      setError('Form must not be empty');
      return;
    }

    inviteToOrganization({
      variables: {
        email
      }
    });

    if (inviteToOrganizationError) {
      setError(inviteToOrganizationError.message.split(':')[1]);
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
    if (!inviteToOrganizationLoading && inviteToOrganizationData) {
      setSuccces('Email has been sent to user!');
      setError('');
    }
  }, [inviteToOrganizationData, inviteToOrganizationLoading]);

  return (
    <div>
      <Card style={styles.card}>
        <CardContent>
          <form action="/">
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
            <Typography variant="h5">Invite to Organization</Typography>
            <div style={styles.formControlPad}>
              <TextField
                name="email"
                placeholder="email"
                fullWidth
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
            onClick={handleInviteToOrganization}
          >
            Invite
          </Button>
          <Button variant="contained" size="small" onClick={goBack}>
            Cancel
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default InviteToOrganizationView;
