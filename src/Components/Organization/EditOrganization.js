import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import flowright from 'lodash.flowright';
import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

class EditOrganizationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      logoUrl: '',
      errorMessage: ''
    };
    this.editOrganization = this.editOrganization.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  editOrganization() {
    const { name, logoUrl } = this.state;

    this.props
      .editOrganization({
        variables: {
          name,
          logoUrl
        }
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

  goBack() {
    this.props.history.goBack();
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.loading) {
      const currentOrganization =
        newProps.getCurrentOrganization.currentOrganization;
      this.setState({
        name: currentOrganization && currentOrganization.name,
        logoUrl: currentOrganization && currentOrganization.logoUrl
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

    if (this.props.loading) return null;
    const currentOrganization = this.props.getCurrentOrganization
      .currentOrganization;
    return (
      <div>
        <Card style={styles.card}>
          <CardContent>
            <form action="/">
              {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
              <Typography variant="h5">Edit your Organization</Typography>
              <div style={styles.formControlPad}>
                <TextField
                  name="name"
                  placeholder="name"
                  fullWidth
                  value={this.state.name || ''}
                  onChange={this.handleChange}
                />
              </div>
              <div style={styles.formControlPad}>
                <TextField
                  name="logoUrl"
                  placeholder="Logo URL"
                  fullWidth
                  value={this.state.logoUrl || ''}
                  onChange={this.handleChange}
                />
              </div>
            </form>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" size="small" disabled>
              Save
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

const getCurrentOrganization = gql`
  query currentOrganization($_id: String!) {
    currentOrganization(_id: $_id) {
      name
      createdAt
      createdById
      logoUrl
    }
  }
`;

const editOrganization = gql`
  mutation editOrganization($name: String!, $logoUrl: String!) {
    editOrganization(name: $name, logoUrl: $logoUrl) {
      _id
      name
      createdAt
      createdById
      logoUrl
    }
  }
`;

export default withRouter(
  flowright(
    graphql(editOrganization, {
      name: 'editOrganization'
    }),
    graphql(getCurrentOrganization, {
      name: 'getCurrentOrganization',
      options: ownProps => ({
        variables: { _id: ownProps.match.params.id },
        forceRefetch: true
      })
    })
  )(withApollo(EditOrganizationView))
);
