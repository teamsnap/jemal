import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import flowright from 'lodash.flowright';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: ''
    };
    this.loginUser = this.loginUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  loginUser() {
    const { email, password } = this.state;
    const token = 'mjml-jwt';

    if (localStorage.getItem(token)) {
      localStorage.removeItem(token);
    }

    this.props
      .login({
        variables: {
          email,
          password
        }
      })
      .then(data => {
        localStorage.setItem(token, data.data.login.jwt);
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
  }

  render() {
    const styles = {
      card: {
        maxWidth: 400,
        margin: '0 auto'
      }
    };
    if (this.props.loading) return null;
    return (
      <div>
        <Card style={styles.card}>
          <CardContent>
            <form action="/">
              {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
              <Typography variant="h5">Login</Typography>
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
              onClick={this.loginUser}
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
      </div>
    );
  }
}

const login = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      _id
      email
      jwt
    }
  }
`;

export default flowright(
  graphql(login, {
    name: 'login'
  })
)(withApollo(LoginForm));
