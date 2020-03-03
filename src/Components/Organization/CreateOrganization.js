import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useHistory } from 'react-router-dom';
import { useMutation, useApolloClient } from 'react-apollo';

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

const CREATE_ORGANIZATION = gql`
  mutation createOrganization($name: String!, $logoUrl: String!) {
    createOrganization(name: $name, logoUrl: $logoUrl) {
      _id
    }
  }
`;

const CreateOrganizationView = () => {
  const [value, setValue] = useState({
    name: '',
    logoUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccces] = useState('');
  const history = useHistory();
  const client = useApolloClient();

  const [
    createOrganization,
    {
      data: createOrganizationData,
      loading: createOrganizationLoading,
      error: createOrganizationError
    }
  ] = useMutation(CREATE_ORGANIZATION);

  const handleCreateOrganization = () => {
    const { name, logoUrl } = value;

    if (!name || !logoUrl) {
      setError('Form must not be empty');
      return;
    }

    createOrganization({
      variables: {
        name,
        logoUrl
      }
    });

    if (createOrganizationError) {
      setError(createOrganizationError.message.split(':')[1]);
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
    if (!createOrganizationLoading && createOrganizationData) {
      setSuccces('Created');
      setError('');
      client.resetStore();
      history.push(
        `/organization/edit/${createOrganizationData.createOrganization._id}`
      );
    }
  }, [createOrganizationData, createOrganizationLoading, history]);

  return (
    <div>
      <Card style={styles.card}>
        <CardContent>
          <form action="/">
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
            <Typography variant="h5">Create a new Organization</Typography>
            <div style={styles.formControlPad}>
              <TextField
                name="name"
                placeholder="name"
                fullWidth
                onChange={handleChange}
              />
            </div>
            <div style={styles.formControlPad}>
              <TextField
                name="logoUrl"
                placeholder="Logo URL"
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
            onClick={handleCreateOrganization}
          >
            Create
          </Button>
          <Button variant="contained" size="small" onClick={goBack}>
            Cancel
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default CreateOrganizationView;
