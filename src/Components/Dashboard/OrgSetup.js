import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useHistory } from 'react-router-dom';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

const styles = {
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

const OrgSetup = ({ user }) => {
  const [value, setValue] = useState({
    name: '',
    logoUrl: '',
    success: '',
    errorMessage: ''
  });
  const [error, setError] = useState('');
  const [
    createOrg,
    { data: createOrgData, loading: createOrgLoading, error: createOrgError }
  ] = useMutation(CREATE_ORGANIZATION);
  const history = useHistory();
  const client = useApolloClient();

  const createOrganization = () => {
    const { name, logoUrl } = value;

    // useHistory;

    createOrg({
      variables: {
        name,
        logoUrl
      }
    });

    if (createOrgError) {
      setError(createOrgError.message.split(':')[1]);
      return;
    }
  };

  useEffect(() => {
    if (
      !createOrgLoading &&
      createOrgData &&
      createOrgData.createOrganization._id
    ) {
      history.push('/');
      client.resetStore();
    }
  }, [createOrgData, createOrgLoading, history, client]);

  const handleChange = e =>
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });

  return (
    <Grid container spacing={24}>
      <Grid item sm={12}>
        <Paper style={styles.paper}>
          <Typography variant="h4" style={styles.heading}>
            Welcome {user && user.firstname}
          </Typography>
          <Paper style={styles.paper}>
            <Grid container spacing={24}>
              <Grid item sm={6}>
                <Card style={styles.card}>
                  <CardContent>
                    <form action="/">
                      {error && <p>{error}</p>}
                      <Typography variant="h5">
                        Create a new Organization
                      </Typography>
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
                      onClick={createOrganization}
                    >
                      Create organization
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item sm={6}>
                <Card style={styles.card}>
                  <CardContent>
                    <Typography variant="h5">Existing organization</Typography>
                    <Typography component="h3">
                      If you think you are apart of an existing organization,
                      please ask your administrator to invite you with the email
                      you used to sign up with.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OrgSetup;
