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

class CreateOrganizationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      logoUrl: '',
      errorMessage: ''
    };
    this.createOrganization = this.createOrganization.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goBack = this.goBack.bind(this);
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
        this.props.history.push(
          `/organization/edit/${data.data.createOrganization._id}`
        );
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
              <Typography variant="h5">Create a new Organization</Typography>
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
              Create
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

const createOrganization = gql`
  mutation createOrganization($name: String!, $logoUrl: String!) {
    createOrganization(name: $name, logoUrl: $logoUrl) {
      _id
    }
  }
`;

export default flowright(
  graphql(createOrganization, {
    name: 'createOrganization'
  })
)(withApollo(withRouter(CreateOrganizationView)));
