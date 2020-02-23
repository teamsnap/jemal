import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery, useApolloClient } from 'react-apollo';

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

const GET_CURRENT_ORGANIZATION = gql`
  query currentOrganization($_id: String!) {
    currentOrganization(_id: $_id) {
      name
      createdAt
      createdById
      logoUrl
    }
  }
`;

const UPDATE_ORGANIZATION = gql`
  mutation updateOrganization($name: String!, $logoUrl: String!) {
    updateOrganization(name: $name, logoUrl: $logoUrl) {
      name
      logoUrl
    }
  }
`;

const EditOrganizationView = () => {
  const [value, setValue] = useState({
    name: '',
    logoUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccces] = useState('');
  const history = useHistory();
  const client = useApolloClient();
  const { id } = useParams();

  const [
    updateOrganization,
    {
      data: updateOrganizationData,
      loading: updateOrganizationLoading,
      error: updateOrganizationError
    }
  ] = useMutation(UPDATE_ORGANIZATION);

  const {
    data: currentOrganizationData,
    loading: currentOrganizationLoading
  } = useQuery(GET_CURRENT_ORGANIZATION, {
    variables: {
      _id: id
    }
  });

  const handleEditOrganization = () => {
    const { name, logoUrl } = value;

    if (!name || !logoUrl) {
      setError('Form must not be empty');
      return;
    }

    updateOrganization({
      variables: {
        name,
        logoUrl
      }
    });

    if (updateOrganizationError) {
      setError(updateOrganizationError.message.split(':')[1]);
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
    if (!updateOrganizationLoading && updateOrganizationData) {
      setSuccces('Updated');
      setError('');
      client.resetStore();
      window.location.reload();
    }
  }, [updateOrganizationData, updateOrganizationLoading]);

  useEffect(() => {
    if (!currentOrganizationLoading && currentOrganizationData) {
      setValue(v => ({
        ...v,
        logoUrl: currentOrganizationData.currentOrganization.logoUrl,
        name: currentOrganizationData.currentOrganization.name
      }));
    }
  }, [currentOrganizationLoading, currentOrganizationData]);

  if (currentOrganizationLoading) return null;

  return (
    <div>
      <Card style={styles.card}>
        <CardContent>
          <form action="/">
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
            <Typography variant="h5">Edit your Organization</Typography>
            <div style={styles.formControlPad}>
              <TextField
                name="name"
                placeholder="name"
                fullWidth
                value={value.name || ''}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formControlPad}>
              <TextField
                name="logoUrl"
                placeholder="Logo URL"
                fullWidth
                value={value.logoUrl || ''}
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
            onClick={handleEditOrganization}
          >
            Save
          </Button>
          <Button variant="contained" size="small" onClick={goBack}>
            Cancel
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default EditOrganizationView;
