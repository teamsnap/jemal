import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

import Loading from '../../Components/Loading/Loading';

const appToken = 'mjml-jwt';

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
  flexEnd: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end'
  },
  paper: {
    padding: 20
  }
};

const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $newPassword: String!
    $verifyPassword: String!
    $resetPasswordToken: String
    $email: String
  ) {
    changePassword(
      newPassword: $newPassword
      verifyPassword: $verifyPassword
      resetPasswordToken: $resetPasswordToken
      email: $email
    ) {
      _id
      email
      jwt
    }
  }
`;

const CURRENT_USER = gql`
  query currentUser {
    currentUser {
      _id
      email
      organization {
        name
        _id
      }
    }
  }
`;

const Settings = () => {
  const [value, setValue] = useState({
    newPassword: '',
    verifyPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccces] = useState('');
  const { data: data_user, loading: loading_user } = useQuery(CURRENT_USER);

  const [
    changePassword,
    {
      data: changePasswordData,
      loading: changePasswordLoading,
      error: changePasswordError
    }
  ] = useMutation(CHANGE_PASSWORD);

  const handleChangePassword = () => {
    const { newPassword, verifyPassword } = value;

    if (!newPassword || !verifyPassword) {
      setError('Form must not be empty');
      return;
    }

    if (newPassword !== verifyPassword) {
      setError('Passwords do not match');
      return;
    }

    changePassword({
      variables: {
        newPassword,
        verifyPassword,
        email: data_user && data_user.currentUser.email
      }
    });

    if (changePasswordError) {
      setError(changePasswordError.message.split(':')[1]);
      return;
    }
  };

  const handleChange = e =>
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });

  useEffect(() => {
    if (
      !changePasswordLoading &&
      changePasswordData &&
      changePasswordData.changePassword
    ) {
      localStorage.setItem(appToken, changePasswordData.changePassword.jwt);
      setSuccces('Password Changed');
      setError('');
    }
  }, [changePasswordData, changePasswordLoading]);

  if (loading_user) return <Loading />;

  return (
    <div style={styles.root}>
      <Grid container spacing={24}>
        <Grid item sm={12}>
          <Paper style={styles.paper}>
            <Typography variant="h4" style={styles.heading}>
              Settings
            </Typography>
            <Paper style={styles.paper}>
              <Grid container spacing={24}>
                <Grid item md={6}>
                  <Card style={styles.card}>
                    <CardContent>
                      <form action="/">
                        {error && <p>{error}</p>}
                        {success && <p>{success}</p>}
                        <Typography variant="h5">Change password</Typography>
                        <div className="field-line">
                          <TextField
                            type="newPassword"
                            name="newPassword"
                            placeholder="new password"
                            fullWidth
                            onChange={handleChange}
                          />
                        </div>
                        <div className="field-line">
                          <TextField
                            type="verifyPassword"
                            name="verifyPassword"
                            placeholder="verify password"
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
                        onClick={handleChangePassword}
                      >
                        Change password
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
