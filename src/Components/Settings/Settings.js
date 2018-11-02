import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card, { CardActions, CardContent } from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

import Loading from '../../Components/Loading/Loading';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      success: '',
      errorMessage: '',
      newPassword: '',
      verifyPassword: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  changePassword() {
    const { newPassword, verifyPassword } = this.state;
    const token = 'mjml-jwt';

    if (localStorage.getItem(token)) {
      localStorage.removeItem(token);
    }

    this.props
      .changePassword({
        variables: {
          newPassword,
          verifyPassword,
          email:
            this.props.currentUser.currentUser &&
            this.props.currentUser.currentUser.email
        }
      })
      .then(data => {
        localStorage.setItem(token, data.data.changePassword.jwt);
        this.setState({ success: 'Password has been reset!' });
      })
      .then(() => (window.location.href = '/settings'))
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

    if (this.props.currentUser.loading) return <Loading />;
    const user =
      this.props.currentUser.currentUser && this.props.currentUser.currentUser;

    return (
      <div style={styles.root}>
        <Grid container spacing={24}>
          <Grid item sm={12}>
            <Paper style={styles.paper}>
              <Typography variant="h4" style={styles.heading}>
                Settings
              </Typography>
              <Paper style={styles.paper}>
                <div style={styles.flexEnd}>
                  {/* <Link to="/email/create"><Button variant="contained" color="primary" size="large">New email</Button></Link> */}
                </div>
                <Grid container spacing={24}>
                  <Grid item md={6}>
                    <Card style={styles.card}>
                      <CardContent>
                        <form action="/">
                          {this.state.errorMessage && (
                            <p>{this.state.errorMessage}</p>
                          )}
                          {this.state.success && <p>{this.state.success}</p>}
                          <Typography variant="h5">
                            Add or Change Organization
                          </Typography>
                          <div className="field-line">
                            <TextField
                              name="org-name"
                              placeholder={`Current Org Name: ${(user &&
                                user.organization &&
                                user.organization.name) ||
                                'none'}`}
                              fullWidth
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="field-line">
                            <TextField
                              name="org-id"
                              placeholder={`Current Org id: ${(user &&
                                user.organization &&
                                user.organization._id) ||
                                'none'}`}
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
                          Add Organization
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item md={6}>
                    <Card style={styles.card}>
                      <CardContent>
                        <form action="/">
                          <Typography variant="h5">
                            Reset password
                          </Typography>
                          <div className="field-line">
                            <TextField
                              type="newPassword"
                              name="newPassword"
                              placeholder="new password"
                              fullWidth
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="field-line">
                            <TextField
                              type="verifyPassword"
                              name="verifyPassword"
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
  }
}

const changePassword = gql`
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

const currentUser = gql`
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

export default withRouter(
  compose(
    graphql(changePassword, {
      name: 'changePassword'
    }),
    graphql(currentUser, {
      name: 'currentUser'
    })
  )(withApollo(Settings))
);
