import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      errorMessage: ''
    };
    this.createUser = this.createUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  createUser() {
    const { email, password, firstname, lastname } = this.state;
    const token = 'mjml-jwt';

    if (localStorage.getItem(token)) {
      localStorage.removeItem(token);
    }

    this.props
      .signup({
        variables: {
          email,
          firstname,
          lastname,
          password
        }
      })
      .then(data => {
        console.log(data.data);
        localStorage.setItem(token, data.data.signup.jwt);
      })
      .then(() => (window.location.href = '/'))
      .catch(error => {
        if (localStorage.getItem(token)) {
          localStorage.removeItem(token);
        }
        console.error(error);
        this.setState({
          errorMessage: error.message.split(':')[1]
        });
      });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    console.log(this.state);
  }

  render() {
    const styles = {
      card: {
        maxWidth: 400,
        margin: '0 auto'
      }
    };
    return (
      <div>
        <Card style={styles.card}>
          <CardContent>
            <form action="/">
              <Typography variant="h5">Create account</Typography>
              <div className="field-line">
                <TextField
                  name="firstname"
                  placeholder="First name"
                  fullWidth
                  onChange={this.handleChange}
                />
              </div>
              <div className="field-line">
                <TextField
                  name="lastname"
                  placeholder="Last name"
                  fullWidth
                  onChange={this.handleChange}
                />
              </div>
              <div className="field-line">
                <TextField
                  name="email"
                  placeholder="email"
                  fullWidth
                  onChange={this.handleChange}
                />
              </div>
              <div className="field-line">
                <TextField
                  type="password"
                  name="password"
                  placeholder="password"
                  fullWidth
                  onChange={this.handleChange}
                />
              </div>
            </form>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.createUser}
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
  }
}

const signup = gql`
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

export default compose(
  graphql(signup, {
    name: 'signup'
  })
)(withApollo(SignupForm));
