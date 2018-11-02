import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

class InviteToOrganizationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errorMessage: '',
      success: ''
    };
    this.inviteToOrganization = this.inviteToOrganization.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  inviteToOrganization() {
    const { email } = this.state;

    this.props
      .inviteToOrganization({
        variables: {
          email
        }
      })
      .then(() => this.setState({ success: 'Email has been sent to user!' }))
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

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const styles = {
      card: {
        maxWidth: 400,
        margin: '0 auto'
      },
      formControl: {
        minWidth: 120
      },
      formControlPad: {
        marginTop: 20
      }
    };

    return (
      <div>
        <Card style={styles.card}>
          <CardContent>
            <form action="/">
              {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
              {this.state.success && <p>{this.state.success}</p>}
              <Typography variant="headline" component="h1">
                Invite to Organization
              </Typography>
              <div style={styles.formControlPad}>
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
              variant="raised"
              color="primary"
              size="small"
              onClick={this.inviteToOrganization}
            >
              Invite
            </Button>
            <Button variant="raised" size="small" onClick={this.goBack}>
              Cancel
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

const inviteToOrganization = gql`
  mutation inviteToOrganization($email: String!) {
    inviteToOrganization(email: $email) {
      email
    }
  }
`;

export default withRouter(
  compose(
    graphql(inviteToOrganization, {
      name: 'inviteToOrganization'
    })
  )(withApollo(InviteToOrganizationView))
);
