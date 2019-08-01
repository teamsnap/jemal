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

class AcceptToOrganizationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errorMessage: '',
      success: ''
    };
    this.input = React.createRef();
    this.acceptToOrganization = this.acceptToOrganization.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  acceptToOrganization() {
    const { email } = this.state;
    const organizationId = this.props.match.params.id;

    this.props
      .acceptToOrganization({
        variables: {
          email,
          organizationId
        }
      })
      .then(() =>
        this.setState({
          success: 'Great! You are now apart of the organization now!'
        })
      )
      .then(() => (window.location = '/'))
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

  componentWillMount() {
    if (!this.props.loading) {
      const currentEmail = this.props.currentUser.currentUser;
      this.setState({
        email: currentEmail && currentEmail.email
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.loading) {
      const currentEmail = newProps.currentUser.currentUser;
      this.setState({
        email: currentEmail && currentEmail.email
      });
    }
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
              <img
                src={
                  this.props.getOrganization.currentOrganization &&
                  this.props.getOrganization.currentOrganization.logoUrl
                }
                alt={
                  this.props.getOrganization.currentOrganization &&
                  this.props.getOrganization.currentOrganization.name
                }
              />
              <Typography variant="h5">
                You have been Invited to{' '}
                {this.props.getOrganization.currentOrganization &&
                  this.props.getOrganization.currentOrganization.name}
              </Typography>
              <div style={styles.formControlPad}>
                <TextField
                  name="email"
                  placeholder="email"
                  fullWidth
                  type="email"
                  value={this.state.email}
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
              onClick={this.acceptToOrganization}
            >
              Invite
            </Button>
            <Button variant="contained" size="small" onClick={this.goBack}>
              Cancel
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

const acceptToOrganization = gql`
  mutation acceptToOrganization($email: String!, $organizationId: String!) {
    acceptToOrganization(email: $email, organizationId: $organizationId) {
      email
    }
  }
`;

const getOrganization = gql`
  query currentOrganization($_id: String!) {
    currentOrganization(_id: $_id) {
      name
      logoUrl
    }
  }
`;

const currentUser = gql`
  query currentUser {
    currentUser {
      _id
      email
    }
  }
`;

export default withRouter(
  compose(
    graphql(acceptToOrganization, {
      name: 'acceptToOrganization'
    }),
    graphql(getOrganization, {
      name: 'getOrganization',
      options: ownProps => ({ variables: { _id: ownProps.match.params.id } })
    }),
    graphql(currentUser, {
      name: 'currentUser'
    })
  )(withApollo(AcceptToOrganizationView))
);
