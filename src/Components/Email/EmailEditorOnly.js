import React, { Component } from "react";
import gql from "graphql-tag";
import { withApollo, graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";

import TextField from "material-ui/TextField";
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from "material-ui/Button";
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';

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
        const {
            title,
            mjmlSource,
            folderPath,
        } = this.state;
        const organizationId = this.props.currentUser.currentUser && this.props.currentUser.currentUser.organizationId
        const _id = this.props.match.params.id

        console.log(this.state)

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
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    errorMessage: error.message.split(":")[1]
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
            const { title, mjmlSource, folderPath } = !newProps.getCurrentEmailPartial.loading && newProps.getCurrentEmailPartial.getCurrentEmailPartial
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
              flexGrow: 1,
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
        }

        return (
            <div style={styles.root}>
                <div style={styles.container}>
                    <Grid container spacing={24}>
                        <Grid item sm={12}>
                            <Paper style={styles.paper}>
                                <Grid container spacing={24}>
                                    <Grid item sm={3}>
                                        <Typography variant="display1" component="h1">Email Partial Editor</Typography>
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
                                    <Grid item sm={2}>
                                        <TextField
                                          name="folderPath"
                                          placeholder="folderPath"
                                          fullWidth
                                          onChange={this.handleChange}
                                          value={this.state.folderPath || ''}
                                        />
                                    </Grid>
                                    <Grid item sm={3}>
                                        <Button variant="raised" color="primary" size="small" onClick={this.editEmailPartial}>Save</Button>
                                        <Button variant="raised" size="small">Duplicate</Button>
                                        <Button variant="raised" size="small">Delete</Button>
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
                              })
                          }}
                          onChange={(editor, data, value) => {
                              this.setState({
                                  mjmlSource: value
                              })
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
  mutation editEmailPartial($_id: String!, $title: String!, $mjmlSource: String!, $folderPath: String, $organizationId: String!) {
      editEmailPartial(_id: $_id, title: $title, mjmlSource: $mjmlSource, folderPath: $folderPath, organizationId: $organizationId) {
          _id
      }
  }
`;

export default withRouter(compose(
  graphql(currentUser, {
      name: "currentUser"
  }),
  graphql(getCurrentEmailPartial, {
      name: "getCurrentEmailPartial",
      options: (ownProps) => ({ variables: { _id: ownProps.match.params.id }, forceRefetch: true})
  }),
  graphql(editEmailPartial, {
      name: "editEmailPartial"
  })
)(withApollo(EmailEditorOnly)));
