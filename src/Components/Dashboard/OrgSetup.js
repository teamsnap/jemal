import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

class OrgSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      logoUrl: '',
      success: '',
      errorMessage: ''
    };

    this.createOrganization = this.createOrganization.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  createOrganization() {
    const { name, logoUrl } = this.state;

    this.props
      .createOrganization({
        variables: {
          name,
          logoUrl
        }
      })
      .then(data => {
        this.props.history.push('/');
        this.props.client.resetStore();
      })
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

    const { user } = this.props;

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
                        {this.state.errorMessage && (
                          <p>{this.state.errorMessage}</p>
                        )}
                        <Typography variant="h5">
                          Create a new Organization
                        </Typography>
                        <div style={styles.formControlPad}>
                          <TextField
                            name="name"
                            placeholder="name"
                            fullWidth
                            onChange={this.handleChange}
                          />
                        </div>
                        <div style={styles.formControlPad}>
                          <TextField
                            name="logoUrl"
                            placeholder="Logo URL"
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
                        onClick={this.createOrganization}
                      >
                        Create organization
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item sm={6}>
                  <Card style={styles.card}>
                    <CardContent>
                      <Typography variant="h5">
                        Existing organization
                      </Typography>
                      <Typography component="h3">
                        If you think you are apart of an existing organization,
                        please ask your administrator to invite you with the
                        email you used to sign up with.
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
  }
}

const createOrganization = gql`
  mutation createOrganization($name: String!, $logoUrl: String!) {
    createOrganization(name: $name, logoUrl: $logoUrl) {
      _id
    }
  }
`;

export default compose(
  graphql(createOrganization, {
    name: 'createOrganization'
  })
)(withApollo(withRouter(OrgSetup)));
