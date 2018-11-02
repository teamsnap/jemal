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
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import Loading from '../../Components/Loading/Loading';

class CreateEmailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      mjmlSource:
        '<mjml>\n   <mj-body >\n       <mj-section >\n         <mj-column>\n               <mj-text>Empty Templates</mj-text >\n          </mj-column>\n      </mj-section>\n     </mj-body>\n</mjml >\n',
      duplicatedFrom: '',
      folderPath: '',
      favorited: false,
      isApproved: false,
      hasBeenSent: false,
      isDraft: true,
      errorMessage: '',
      baseTemplate: false,
      baseTemplateTitle: ''
    };
    this.createEmail = this.createEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  createEmail() {
    const {
      title,
      mjmlSource,
      baseTemplate,
      duplicatedFrom,
      folderPath,
      favorited,
      isApproved,
      hasBeenSent,
      isDraft
    } = this.state;
    const organizationId =
      this.props.currentUser.currentUser &&
      this.props.currentUser.currentUser.organizationId;
    console.log(organizationId);

    this.props
      .createEmail({
        variables: {
          title,
          mjmlSource,
          baseTemplate,
          duplicatedFrom,
          folderPath,
          favorited,
          isApproved,
          hasBeenSent,
          isDraft,
          organizationId
        }
      })
      .then(data => {
        this.props.history.push(`/email/edit/${data.data.createEmail._id}`);
      })
      .catch(error => {
        console.error(error);
        this.setState({
          errorMessage: error.message.split(':')[1]
        });
      });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleMJML = event => {
    this.setState({
      mjmlSource: event.target.value
    });
  };

  goBack() {
    this.props.history.goBack();
  }

  render() {
    if (this.props.getBaseTemplateEmails.loading) return <Loading />;

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

    const baseTemplates =
      this.props.getBaseTemplateEmails &&
      this.props.getBaseTemplateEmails.getBaseTemplateEmails;

    let renderBaseTemplates;

    if (baseTemplates) {
      renderBaseTemplates = baseTemplates.map(({ title, mjmlSource, _id }) => {
        return (
          <MenuItem key={_id} value={mjmlSource}>
            {title}
          </MenuItem>
        );
      });
    }

    return (
      <div>
        <Card style={styles.card}>
          <CardContent>
            <form action="/">
              <Typography variant="headline" component="h1">
                Create a new email
              </Typography>
              <div style={styles.formControlPad}>
                <TextField
                  name="title"
                  placeholder="name"
                  fullWidth
                  onChange={this.handleChange}
                  value={this.state.title}
                />
              </div>
              <div style={styles.formControlPad}>
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
              <div style={styles.formControlPad}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="baseTemplate">Base Templates</InputLabel>
                  <Select
                    value={this.state.mjmlSource}
                    onChange={this.handleMJML}
                    inputProps={{
                      name: 'baseTemplateTitle',
                      id: 'baseTemplate'
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {renderBaseTemplates}
                  </Select>
                </FormControl>
              </div>
            </form>
          </CardContent>
          <CardActions>
            <Button
              variant="raised"
              color="primary"
              size="small"
              onClick={this.createEmail}
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

const getBaseTemplateEmails = gql`
  query getBaseTemplateEmails($_id: String!, $baseTemplate: Boolean!) {
    getBaseTemplateEmails(_id: $_id, baseTemplate: $baseTemplate) {
      title
      mjmlSource
      _id
    }
  }
`;

const createEmail = gql`
  mutation createEmail(
    $title: String!
    $mjmlSource: String
    $baseTemplate: Boolean
    $duplicatedFrom: String
    $folderPath: String
    $favorited: Boolean
    $isApproved: Boolean
    $hasBeenSent: Boolean
    $isDraft: Boolean
    $organizationId: String!
  ) {
    createEmail(
      title: $title
      mjmlSource: $mjmlSource
      baseTemplate: $baseTemplate
      duplicatedFrom: $duplicatedFrom
      folderPath: $folderPath
      favorited: $favorited
      isApproved: $isApproved
      hasBeenSent: $hasBeenSent
      isDraft: $isDraft
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
    graphql(getBaseTemplateEmails, {
      name: 'getBaseTemplateEmails',
      options: ownProps => ({
        variables: {
          _id:
            !ownProps.currentUser.loading &&
            ownProps.currentUser.currentUser &&
            ownProps.currentUser.currentUser.organizationId,
          baseTemplate: true
        }
      })
    }),
    graphql(createEmail, {
      name: 'createEmail'
    })
  )(withApollo(CreateEmailView))
);
