import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { Link, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const appToken = 'mjml-jwt';
const styles = {
  card: {
    maxWidth: 400,
    margin: '0 auto'
  }
};

const REQUEST_RESET_PASSWORD = gql`
  mutation requestResetPassword($email: String!) {
    requestResetPassword(email: $email) {
      email
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $newPassword: String!
    $verifyPassword: String!
    $resetPasswordToken: String
    $email: String!
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

const ForgotForm = () => {
  const [value, setValue] = useState({
    email: '',
    password: '',
    newPassword: '',
    verifyPassword: ''
  });
  const { token } = useParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [
    changePass,
    { data: changePassData, loading: changePassLoading, error: changePassError }
  ] = useMutation(CHANGE_PASSWORD);
  const [
    requestReset,
    {
      data: requestResetData,
      loading: requestResetLoading,
      error: requestResetError
    }
  ] = useMutation(REQUEST_RESET_PASSWORD);

  const changePassword = () => {
    const { newPassword, verifyPassword, email } = value;

    if (!newPassword || !verifyPassword || !token || !email) {
      return;
    }

    setTimeout(() => setError(''), 3000);

    if (localStorage.getItem(appToken)) {
      localStorage.removeItem(appToken);
    }

    changePass({
      variables: {
        newPassword,
        verifyPassword,
        resetPasswordToken: token,
        email
      }
    });

    if (changePassError) {
      setError(changePassError.message.split(':')[1]);
      if (localStorage.getItem(appToken)) {
        localStorage.removeItem(appToken);
      }
      return;
    }
  };

  const requestResetPassword = () => {
    const { email } = value;

    if (!email) {
      return;
    }

    setTimeout(() => setError(''), 3000);

    if (localStorage.getItem(appToken)) {
      localStorage.removeItem(appToken);
    }

    requestReset({
      variables: {
        email
      }
    });

    if (requestResetError) {
      setError(requestResetError.message.split(':')[1]);
      if (localStorage.getItem(appToken)) {
        localStorage.removeItem(appToken);
      }
      return;
    }

    if (!requestResetLoading && requestResetData) {
      setSuccess('Please check your email!');
    }
  };

  const handleChange = e =>
    setValue({ ...value, [e.target.name]: e.target.value });

  useEffect(() => {
    if (!changePassLoading && changePassData && changePassData.changePassword) {
      setSuccess('Password has been reset!');
      localStorage.setItem(appToken, changePassData.changePassword.jwt);
      window.location.href = '/';
    }
  }, [changePassData, changePassLoading]);

  return (
    <>
      {token ? (
        <Card style={styles.card}>
          <CardContent>
            <form action="/">
              {error && <p>{error}</p>}
              {success && <p>{success}</p>}
              <Typography variant="h5">Change your password</Typography>
              <div className="field-line">
                <TextField
                  name="email"
                  placeholder="email you sent the reset to"
                  fullWidth
                  onChange={handleChange}
                />
              </div>
              <div className="field-line">
                <TextField
                  name="verifyPassword"
                  placeholder="new password"
                  fullWidth
                  onChange={handleChange}
                />
              </div>
              <div className="field-line">
                <TextField
                  name="newPassword"
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
              onClick={changePassword}
            >
              Reset password
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Card style={styles.card}>
          <CardContent>
            <form action="/">
              {error && <p>{error}</p>}
              {success && <p>{success}</p>}
              <Typography variant="h5">Request password reset</Typography>
              <div className="field-line">
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
              onClick={requestResetPassword}
            >
              Send me password reset link
            </Button>
            <Link to="/login">
              <Button variant="contained" size="small">
                Log in
              </Button>
            </Link>
          </CardActions>
        </Card>
      )}
    </>
  );
};

export default ForgotForm;
