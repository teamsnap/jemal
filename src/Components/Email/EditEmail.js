import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import './EditEmail.css';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import SvgIcon from 'material-ui/SvgIcon';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';

import Loading from '../../Components/Loading/Loading';

function HeartOutlineIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
    </SvgIcon>
  );
}

function HeartIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </SvgIcon>
  );
}

class Iframe extends React.Component {
  constructor(props) {
    super(props);
    this.iframe = React.createRef();
  }
  /**
   * Called after mounting the component. Triggers initial update of
   * the iframe
   */
  componentDidMount() {
    this._updateIframe();
  }

  /**
   * Called each time the props changes. Triggers an update of the iframe to
   * pass the new content
   */
  componentDidUpdate() {
    this._updateIframe();
  }

  /**
   * Updates the iframes content and inserts stylesheets.
   * TODO: Currently stylesheets are just added for proof of concept. Implement
   * and algorithm which updates the stylesheets properly.
   */
  _updateIframe() {
    const iframe = this.refs.iframe;
    const document = iframe.contentDocument;
    document.body.innerHTML = this.props.content;
  }

  /**
   * This component renders just and iframe
   */
  render() {
    return <iframe ref="iframe" title={this.props.title} {...this.props} />;
  }
}

class EditEmailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      mjmlSource: '',
      baseTemplate: false,
      duplicatedFrom: '',
      folderPath: '',
      favorited: false,
      isApproved: false,
      hasBeenSent: false,
      isDraft: false,
      errorMessage: '',
      copied: false
    };
    this.editEmail = this.editEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.goBack = this.goBack.bind(this);
    this.iframe = React.createRef();
    this.duplicate = this.duplicate.bind(this);
    this.delete = this.delete.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  duplicate() {
    this.props
      .duplicateEmail({
        variables: {
          _id: this.props.match.params.id
        }
      })
      .then(data => {
        this.props.history.push(`/email/edit/${data.data.duplicateEmail._id}`);
      })
      .catch(error => {
        console.error(error);
        this.setState({
          errorMessage: error.message.split(':')[1]
        });
      });
  }

  delete() {
    this.props
      .deleteEmail({
        variables: {
          _id: this.props.match.params.id
        }
      })
      .then(data => {
        this.props.client.resetStore();
      })
      .then(data => {
        this.props.history.push('/');
      })
      .catch(error => {
        console.error(error);
        this.setState({
          errorMessage: error.message.split(':')[1]
        });
      });
  }

  editEmail() {
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
    const _id = this.props.match.params.id;

    console.log(this.state);

    this.props
      .editEmail({
        variables: {
          _id,
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
        },
        refetchQueries: [`getCurrentEmail`]
      })
      .then(data => {
        console.log(data);
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

  toggleFavorite = () => flop => {
    // this.setState({ favorited: flop });

    const {
      title,
      mjmlSource,
      baseTemplate,
      duplicatedFrom,
      folderPath,
      isApproved,
      favorited,
      hasBeenSent,
      isDraft
    } = this.state;
    const organizationId =
      this.props.currentUser.currentUser &&
      this.props.currentUser.currentUser.organizationId;
    const _id = this.props.match.params.id;

    this.props
      .editEmail({
        variables: {
          _id,
          title,
          mjmlSource,
          baseTemplate,
          duplicatedFrom,
          folderPath,
          favorited: !favorited,
          isApproved,
          hasBeenSent,
          isDraft,
          organizationId
        },
        refetchQueries: [`getCurrentEmail`]
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
        this.setState({
          errorMessage: error.message.split(':')[1]
        });
      });
  };

  handleToggle = name => event => {
    this.setState({ [name]: event.target.checked });

    const {
      title,
      mjmlSource,
      duplicatedFrom,
      folderPath,
      favorited
    } = this.state;
    const organizationId =
      this.props.currentUser.currentUser &&
      this.props.currentUser.currentUser.organizationId;
    const _id = this.props.match.params.id;
    let isApproved = this.state.isApproved;
    let hasBeenSent = this.state.hasBeenSent;
    let isDraft = this.state.isDraft;
    let baseTemplate = this.state.baseTemplate;

    if (name === 'isApproved') {
      isApproved = event.target.checked;
    }

    if (name === 'hasBeenSent') {
      hasBeenSent = event.target.checked;
    }

    if (name === 'isDraft') {
      isDraft = event.target.checked;
    }

    if (name === 'baseTemplate') {
      baseTemplate = event.target.checked;
    }

    this.props
      .editEmail({
        variables: {
          _id,
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
        },
        refetchQueries: [`getCurrentEmail`]
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
        this.setState({
          errorMessage: error.message.split(':')[1]
        });
      });
  };

  goBack() {
    this.props.history.goBack();
  }

  iframe() {
    const iframe = this.refs.iframe;
    const document = iframe.contentDocument;
    document.body.innerHTML = this.props.content;
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.loading) {
      if (newProps.getCurrentEmail.error) {
        console.log(newProps.getCurrentEmail.error);
        this.setState({
          errorMessage: newProps.getCurrentEmail.error.message.split(':')[1]
        });
        return;
      }

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
      } =
        !newProps.getCurrentEmail.loading &&
        newProps.getCurrentEmail.getCurrentEmail;

      this.setState({
        title,
        mjmlSource,
        baseTemplate,
        duplicatedFrom,
        folderPath,
        favorited,
        isApproved,
        hasBeenSent,
        isDraft
      });
    }
  }

  componentWillMount() {
    if (!this.props.loading) {
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
      } =
        !this.props.getCurrentEmail.loading &&
        this.props.getCurrentEmail.getCurrentEmail;
      this.setState({
        title,
        mjmlSource,
        baseTemplate,
        duplicatedFrom,
        folderPath,
        favorited,
        isApproved,
        hasBeenSent,
        isDraft
      });
    }
  }

  render() {
    const styles = {
      root: {
        flexGrow: 1
      },
      container: {
        padding: 20
      },
      paper: {
        padding: 20
      },
      iframe: {
        width: '100%',
        height: '80vh'
      }
    };

    if (this.props.getCurrentEmail.loading) return <Loading />;
    const email =
      !this.props.getCurrentEmail.loading &&
      this.props.getCurrentEmail.getCurrentEmail;

    return (
      <React.Fragment>
        {!this.state.errorMessage ? (
          <div style={styles.root}>
            <div style={styles.container}>
              <Grid container spacing={24}>
                <Grid item sm={12}>
                  <Paper style={styles.paper}>
                    <Grid container spacing={24}>
                      <Grid item sm={2}>
                        <Typography variant="display1" component="h1">
                          Email Editor
                        </Typography>
                      </Grid>
                      <Grid item sm={3}>
                        <TextField
                          name="title"
                          placeholder="title"
                          fullWidth
                          onChange={this.handleChange}
                          value={this.state.title || ''}
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              value="isApproved"
                              checked={this.state.isApproved}
                              onChange={this.handleToggle('isApproved')}
                              color="primary"
                              name="isApproved"
                            />
                          }
                          label="Approved"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              value="isDraft"
                              checked={this.state.isDraft}
                              onChange={this.handleToggle('isDraft')}
                              color="primary"
                              name="isDraft"
                            />
                          }
                          label="Draft"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              value="hasBeenSent"
                              checked={this.state.hasBeenSent}
                              onChange={this.handleToggle('hasBeenSent')}
                              color="primary"
                              name="hasBeenSent"
                            />
                          }
                          label="Sent"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              value="baseTemplate"
                              checked={this.state.baseTemplate}
                              onChange={this.handleToggle('baseTemplate')}
                              color="primary"
                              name="baseTemplate"
                            />
                          }
                          label="Base Template"
                        />
                        {this.state.favorited ? (
                          <HeartIcon
                            color="primary"
                            onClick={this.toggleFavorite(true)}
                          />
                        ) : (
                          <HeartOutlineIcon
                            color="secondary"
                            onClick={this.toggleFavorite(false)}
                          />
                        )}
                      </Grid>
                      <Grid item sm={3}>
                        {this.state.copied ? (
                          <span
                            onClick={() => this.setState({ copied: false })}
                            style={{
                              position: 'absolute',
                              backgroundColor: 'white',
                              padding: 20,
                              borderRadius: 8,
                              right: 200,
                              top: 20,
                              zIndex: 100
                            }}
                          >
                            Copied. [Close]
                          </span>
                        ) : null}
                        <Button
                          variant="raised"
                          color="primary"
                          size="small"
                          onClick={this.editEmail}
                        >
                          Save
                        </Button>
                        <CopyToClipboard
                          text={email.urlPreview}
                          onCopy={() => this.setState({ copied: true })}
                        >
                          <Button variant="raised" color="primary" size="small">
                            Copy HTML
                          </Button>
                        </CopyToClipboard>
                        <Button
                          variant="raised"
                          size="small"
                          onClick={this.duplicate}
                        >
                          Duplicate
                        </Button>
                        <Button
                          variant="raised"
                          size="small"
                          onClick={this.delete}
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </div>
            <Grid container spacing={24}>
              <Grid item sm={6}>
                <CodeMirror
                  value={this.state.mjmlSource}
                  options={{
                    mode: 'xml',
                    theme: 'material',
                    lineNumbers: true,
                    lineWrapping: true
                  }}
                  onBeforeChange={(editor, data, value) => {
                    this.setState({
                      mjmlSource: value
                    });
                  }}
                  onChange={(editor, data, value) => {
                    this.setState({
                      mjmlSource: value
                    });
                  }}
                />
              </Grid>
              <Grid item sm={6} style={{ paddingRight: 40 }}>
                <Iframe
                  style={styles.iframe}
                  content={email.urlPreview}
                  title={email.title}
                />
              </Grid>
            </Grid>
          </div>
        ) : (
          <div style={styles.root}>
            <div style={styles.container}>
              <Grid container spacing={24}>
                <Grid item sm={12}>
                  <Paper style={styles.paper}>
                    <Paper style={styles.paper}>
                      <Typography
                        variant="display1"
                        component="h1"
                        style={{ paddingBottom: 20 }}
                      >
                        Error: {this.state.errorMessage}
                      </Typography>
                      <Button
                        variant="raised"
                        size="small"
                        onClick={this.goBack}
                      >
                        Go back
                      </Button>
                    </Paper>
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

// TODO: Add query for favorites only
// TODO: Add limiting to query

const currentUser = gql`
  query currentUser {
    currentUser {
      _id
      organizationId
    }
  }
`;

const getCurrentEmail = gql`
  query getCurrentEmail($_id: String!) {
    getCurrentEmail(_id: $_id) {
      _id
      title
      updatedAt
      mjmlSource
      baseTemplate
      duplicatedFrom
      folderPath
      favorited
      isApproved
      hasBeenSent
      isDraft
      urlPreview
    }
  }
`;

const editEmail = gql`
  mutation editEmail(
    $_id: String!
    $title: String!
    $mjmlSource: String!
    $baseTemplate: Boolean
    $folderPath: String
    $favorited: Boolean
    $isApproved: Boolean
    $hasBeenSent: Boolean
    $isDraft: Boolean
    $organizationId: String!
  ) {
    editEmail(
      _id: $_id
      title: $title
      mjmlSource: $mjmlSource
      baseTemplate: $baseTemplate
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

const duplicateEmail = gql`
  mutation duplicateEmail($_id: String!) {
    duplicateEmail(_id: $_id) {
      _id
    }
  }
`;

const deleteEmail = gql`
  mutation deleteEmail($_id: String!) {
    deleteEmail(_id: $_id) {
      _id
    }
  }
`;

export default withRouter(
  compose(
    graphql(duplicateEmail, {
      name: 'duplicateEmail'
    }),
    graphql(deleteEmail, {
      name: 'deleteEmail'
    }),
    graphql(currentUser, {
      name: 'currentUser'
    }),
    graphql(getCurrentEmail, {
      name: 'getCurrentEmail',
      options: ownProps => ({
        variables: { _id: ownProps.match.params.id },
        forceRefetch: true
      })
    }),
    graphql(editEmail, {
      name: 'editEmail'
    })
  )(withApollo(EditEmailView))
);
