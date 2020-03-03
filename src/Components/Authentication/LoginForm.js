import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
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

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      _id
      email
      jwt
    }
  }
`;

const LoginForm = () => {
  const [value, setValue] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [
    login,
    { data: loginData, loading: loginLoading, error: loginError }
  ] = useMutation(LOGIN);

  const loginUser = () => {
    const { email, password } = value;

    if (!email || !password) {
      setError('Form must not be empty');
      return;
    }

    login({ variables: { email, password } });

    if (loginError) {
      setError(loginError.message.split(':')[1]);
      if (localStorage.getItem(appToken)) {
        localStorage.removeItem(appToken);
      }
      return;
    }
  };

  useEffect(() => {
    if (!loginLoading && loginData && loginData.login) {
      localStorage.setItem(appToken, loginData.login.jwt);
      window.location.href = '/';
    }
  }, [loginData, loginLoading]);

  const handleChange = e =>
    setValue({ ...value, [e.target.name]: e.target.value });

  return (
    <Card style={styles.card}>
      <CardContent>
        <form action="/">
          {error && <p>{error}</p>}
          <Typography variant="h5">Login</Typography>
          <div className="field-line">
            <TextField
              name="email"
              placeholder="email"
              fullWidth
              onChange={handleChange}
            />
          </div>
          <div className="field-line">
            <TextField
              type="password"
              name="password"
              placeholder="password"
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
          onClick={loginUser}
        >
          Login
        </Button>
        <Link to="/signup">
          <Button variant="contained" size="small">
            New account
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default LoginForm;
