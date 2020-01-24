import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import flowright from 'lodash.flowright';
import { withRouter } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';

import Loading from '../../Components/Loading/Loading';

class EmailEditorOnly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      mjmlSource: '',
      folderPath: '',
      errorMessage: ''
    };
    this.editEmailPartial = this.editEmailPartial.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  editEmailPartial() {
    const { title, mjmlSource, folderPath } = this.state;
    const organizationId =
      !this.props.currentUser.loading &&
      this.props.currentUser.currentUser &&
      this.props.currentUser.currentUser.organizationId;
    const _id = this.props.match.params.id;

    this.props
      .editEmailPartial({
        variables: {
          _id,
          title,
          mjmlSource,
          folderPath,
          organizationId
        },
        refetchQueries: [`getCurrentEmailPartial`]
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
    if (!newProps.getCurrentEmailPartial.loading) {
      const { title, mjmlSource, folderPath } =
        !newProps.getCurrentEmailPartial.loading &&
        newProps.getCurrentEmailPartial.getCurrentEmailPartial;
      this.setState({
        title,
        mjmlSource,
        folderPath
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

    if (this.props.getCurrentEmailPartial.loading) return <Loading />;

    return (
      <div style={styles.root}>
        <div style={styles.container}>
          <Grid container spacing={24}>
            <Grid item sm={12}>
              <Paper style={styles.paper}>
                <Grid container spacing={24}>
                  <Grid item sm={5}>
                    <Typography variant="h6" component="h4">
                      Email Partial Editor
                    </Typography>
                    <TextField
                      name="title"
                      placeholder="title"
                      fullWidth
                      onChange={this.handleChange}
                      value={this.state.title || ''}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <TextField
                      name="folderPath"
                      placeholder="folderPath"
                      fullWidth
                      onChange={this.handleChange}
                      value={this.state.folderPath || ''}
                      style={{ marginTop: 23 }}
                    />
                  </Grid>
                  <Grid
                    item
                    sm={3}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={this.editEmailPartial}
                      style={{ marginLeft: 10 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      style={{ marginLeft: 10 }}
                    >
                      Duplicate
                    </Button>
                    <Button variant="outlined" size="small" color="secondary">
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </div>
        <Grid container spacing={24}>
          <Grid item xs={12}>
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
        </Grid>
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

const getCurrentEmailPartial = gql`
  query getCurrentEmailPartial($_id: String!) {
    getCurrentEmailPartial(_id: $_id) {
      _id
      title
      mjmlSource
      folderPath
    }
  }
`;

const editEmailPartial = gql`
  mutation editEmailPartial(
    $_id: String!
    $title: String!
    $mjmlSource: String!
    $folderPath: String
    $organizationId: String!
  ) {
    editEmailPartial(
      _id: $_id
      title: $title
      mjmlSource: $mjmlSource
      folderPath: $folderPath
      organizationId: $organizationId
    ) {
      _id
    }
  }
`;

export default withRouter(
  flowright(
    graphql(currentUser, {
      name: 'currentUser'
    }),
    graphql(getCurrentEmailPartial, {
      name: 'getCurrentEmailPartial',
      options: ownProps => ({
        variables: { _id: ownProps.match.params.id },
        forceRefetch: true
      })
    }),
    graphql(editEmailPartial, {
      name: 'editEmailPartial'
    })
  )(withApollo(EmailEditorOnly))
);
