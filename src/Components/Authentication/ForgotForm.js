import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import flowright from 'lodash.flowright';
import { Link, withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

class ForgotForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      success: '',
      errorMessage: '',
      newPassword: '',
      verifyPassword: ''
    };
    this.requestResetPassword = this.requestResetPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  changePassword() {
    const { newPassword, verifyPassword, email } = this.state;
    const token = 'mjml-jwt';

    if (localStorage.getItem(token)) {
      localStorage.removeItem(token);
    }

    this.props
      .changePassword({
        variables: {
          newPassword,
          verifyPassword,
          resetPasswordToken: this.props.match.params.token,
          email
        }
      })
      .then(data => {
        localStorage.setItem(token, data.data.changePassword.jwt);
        this.setState({ success: 'Password has been reset!' });
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

  requestResetPassword() {
    const { email } = this.state;
    const token = 'mjml-jwt';

    if (localStorage.getItem(token)) {
      localStorage.removeItem(token);
    }

    this.props
      .requestResetPassword({
        variables: {
          email
        }
      })
      .then(() => this.setState({ success: 'Please check your email!' }))
      .catch(error => {
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
    return (
      <div>
        {this.props.match.params.token ? (
          <Card style={styles.card}>
            <CardContent>
              <form action="/">
                {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
                {this.state.success && <p>{this.state.success}</p>}
                <Typography variant="h5">Change your password</Typography>
                <div className="field-line">
                  <TextField
                    name="email"
                    placeholder="email you sent the reset to"
                    fullWidth
                    onChange={this.handleChange}
                  />
                </div>
                <div className="field-line">
                  <TextField
                    name="verifyPassword"
                    placeholder="new password"
                    fullWidth
                    onChange={this.handleChange}
                  />
                </div>
                <div className="field-line">
                  <TextField
                    name="newPassword"
                    placeholder="verify password"
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
                onClick={this.changePassword}
              >
                Reset password
              </Button>
            </CardActions>
          </Card>
        ) : (
          <Card style={styles.card}>
            <CardContent>
              <form action="/">
                {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
                {this.state.success && <p>{this.state.success}</p>}
                <Typography variant="h5">Request password reset</Typography>
                <div className="field-line">
                  <TextField
                    name="email"
                    placeholder="email"
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
                onClick={this.requestResetPassword}
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
      </div>
    );
  }
}

const requestResetPassword = gql`
  mutation requestResetPassword($email: String!) {
    requestResetPassword(email: $email) {
      email
    }
  }
`;

const changePassword = gql`
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

export default withRouter(
  flowright(
    graphql(requestResetPassword, {
      name: 'requestResetPassword'
    }),
    graphql(changePassword, {
      name: 'changePassword'
    })
  )(withApollo(ForgotForm))
);
