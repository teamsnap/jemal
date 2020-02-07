import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';

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
  }
};

const SIGNUP = gql`
  mutation signup(
    $email: String!
    $password: String!
    $firstname: String
    $lastname: String
  ) {
    signup(
      email: $email
      password: $password
      firstname: $firstname
      lastname: $lastname
    ) {
      _id
      email
      jwt
    }
  }
`;

const SignupForm = () => {
  const [value, setValue] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: ''
  });

  const [
    signup,
    { data: signupData, loading: signupLoading, error: signupError }
  ] = useMutation(SIGNUP);

  const createUser = () => {
    const { email, password, firstname, lastname } = value;
    const token = 'mjml-jwt';

    if (!email || !password || !firstname || !lastname) {
      return;
    }

    if (localStorage.getItem(token)) {
      localStorage.removeItem(token);
    }

    signup({ variables: { email, password, firstname, lastname } });

    if (signupError) {
      console.log(signupError);
      return;
    }

    if (!signupLoading && signupData && signupData.signup) {
      localStorage.setItem(token, signupData.signup.jwt);
      window.location.href = '/';
    }
  };

  const handleChange = e =>
    setValue({ ...value, [e.target.name]: e.target.value });

  return (
    <div>
      <Card style={styles.card}>
        <CardContent>
          <form action="/">
            {signupError && <p>{signupError.toString()}</p>}
            <Typography variant="h5">Create account</Typography>
            <div className="field-line">
              <TextField
                name="firstname"
                placeholder="First name"
                fullWidth
                onChange={handleChange}
              />
            </div>
            <div className="field-line">
              <TextField
                name="lastname"
                placeholder="Last name"
                fullWidth
                onChange={handleChange}
              />
            </div>
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
            onClick={createUser}
          >
            Create account
          </Button>
          <Link to="/login">
            <Button variant="contained" size="small">
              Log in
            </Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
};

export default SignupForm;
