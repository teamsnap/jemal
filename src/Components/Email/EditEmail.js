import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import './EditEmail.css';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { Controlled as CodeMirror } from 'react-codemirror2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'codemirror/mode/xml/xml';
import { countColumn } from 'codemirror';

import Loading from '../../Components/Loading/Loading';
import Iframe from './Iframe';
import HeartOutlineIcon from '../Icons/HeartOutlineIcon';
import HeartIcon from '../Icons/HeartIcon';

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
      copied: false,
      loading: {
        screenshot: false
      }
    };
    this.editEmail = this.editEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.goBack = this.goBack.bind(this);
    this.iframe = React.createRef();
    this.duplicate = this.duplicate.bind(this);
    this.delete = this.delete.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.downloadScreenshot = this.downloadScreenshot.bind(this);
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

  downloadScreenshot() {
    this.setState({
      loading: {
        screenshot: true
      }
    });

    this.props
      .createCurrentEmailScreenshot({
        variables: {
          _id: this.props.match.params.id
        }
      })
      .then(({ data }) => {
        const link = document.createElement('a');
        link.href = data.createCurrentEmailScreenshot.screenshotDownloadUrl;
        link.setAttribute('download', 'download');

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.setState({
          loading: {
            screenshot: false
          }
        });
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
        height: '80vh',
        border: 'none'
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
                      <Grid item sm={4}>
                        <Typography
                          variant="h6"
                          component="h4"
                          style={{ marginBottom: 20 }}
                        >
                          Email Editor
                        </Typography>
                        <TextField
                          name="title"
                          placeholder="title"
                          fullWidth
                          onChange={this.handleChange}
                          value={this.state.title || ''}
                        />
                      </Grid>
                      <Grid
                        item
                        sm={4}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexWrap: 'wrap'
                        }}
                      >
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
                      <Grid
                        item
                        sm={4}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end'
                        }}
                      >
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
                          variant="contained"
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
                          <Button
                            color="primary"
                            size="small"
                            style={{ marginLeft: 10 }}
                          >
                            Copy HTML
                          </Button>
                        </CopyToClipboard>
                        <Button
                          color="primary"
                          size="small"
                          style={{ marginLeft: 10 }}
                          onClick={this.downloadScreenshot}
                        >
                          Screenshot
                        </Button>
                        <Button
                          size="small"
                          onClick={this.duplicate}
                          style={{ marginLeft: 10 }}
                        >
                          Duplicate
                        </Button>
                        <Button
                          size="small"
                          color="secondary"
                          onClick={this.delete}
                          style={{ marginLeft: 10 }}
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
              <Grid item sm={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                  onRenderLine={(editor, cm, line) => {
                    const charWidth = editor.defaultCharWidth(),
                      basePadding = 4;
                    const off =
                      countColumn(cm.text, null, editor.options.tabSize) *
                      charWidth;
                    line.style.textIndent = '-' + off + 'px';
                    line.style.paddingLeft = basePadding + off + 'px';
                  }}
                />
              </Grid>
              <Grid item sm={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                      <Typography variant="h4" style={{ paddingBottom: 20 }}>
                        Error: {this.state.errorMessage}
                      </Typography>
                      <Button
                        variant="contained"
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

const createCurrentEmailScreenshot = gql`
  mutation createCurrentEmailScreenshot($_id: String!) {
    createCurrentEmailScreenshot(_id: $_id) {
      _id
      screenshotDownloadUrl
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
    }),
    graphql(createCurrentEmailScreenshot, {
      name: 'createCurrentEmailScreenshot'
    })
  )(withApollo(EditEmailView))
);
