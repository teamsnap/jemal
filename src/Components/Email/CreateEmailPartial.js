import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

class CreateEmailPartialView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      mjmlSource: '',
      folderPath: '',
      errorMessage: ''
    };
    this.createEmailPartial = this.createEmailPartial.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  createEmailPartial() {
    const { title, mjmlSource, folderPath } = this.state;
    const organizationId =
      this.props.currentUser.currentUser &&
      this.props.currentUser.currentUser.organizationId;
    console.log(organizationId);

    this.props
      .createEmailPartial({
        variables: {
          title,
          mjmlSource,
          folderPath,
          organizationId
        }
      })
      .then(data => {
        this.props.history.push(
          `/email/partials/edit/${data.data.createEmailPartial._id}`
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
        // margin: theme.spacing.unit,
        minWidth: 120
      },
      formControlPad: {
        marginTop: 20
      },
      selectEmpty: {
        // marginTop: theme.spacing.unit * 2,
      }
    };
    return (
      <div>
        <Card style={styles.card}>
          <CardContent>
            <form action="/">
              <Typography variant="headline" component="h1">
                Create a new email template partial
              </Typography>
              <div style={styles.formControlPad}>
                <TextField
                  floatingLabelText="title"
                  name="title"
                  placeholder="title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  fullWidth
                />
              </div>
              <div>
                <TextField
                  floatingLabelText="folderPath"
                  type="folderPath"
                  name="folderPath"
                  placeholder="folderPath"
                  value={this.state.folderPath}
                  onChange={this.handleChange}
                  fullWidth
                />
              </div>
            </form>
          </CardContent>
          <CardActions>
            <Button
              variant="raised"
              color="primary"
              size="small"
              onClick={this.createEmailPartial}
            >
              Create
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

const currentUser = gql`
  query currentUser {
    currentUser {
      _id
      organizationId
    }
  }
`;

const createEmailPartial = gql`
  mutation createEmailPartial(
    $title: String!
    $mjmlSource: String
    $filePath: String
    $organizationId: String!
  ) {
    createEmailPartial(
      title: $title
      mjmlSource: $mjmlSource
      filePath: $filePath
      organizationId: $organizationId
    ) {
      _id
    }
  }
`;

export default withRouter(
  compose(
    graphql(currentUser, {
      name: 'currentUser'
    }),
    graphql(createEmailPartial, {
      name: 'createEmailPartial'
    })
  )(withApollo(CreateEmailPartialView))
);
