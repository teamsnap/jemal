import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import { useParams } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';

import Loading from '../../Components/Loading/Loading';

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

const CURRENT_USER = gql`
  query currentUser {
    currentUser {
      _id
      organizationId
    }
  }
`;

const GET_CURRENT_EMAIL_PARTIAL = gql`
  query getCurrentEmailPartial($_id: String!) {
    getCurrentEmailPartial(_id: $_id) {
      _id
      title
      mjmlSource
      folderPath
    }
  }
`;

const EDIT_EMAIL_PARTIAL = gql`
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
      title
      mjmlSource
      folderPath
    }
  }
`;

const DUPLICATE_EMAIL_PARTIAL = gql`
  mutation duplicateEmailPartial($_id: String!) {
    duplicateEmailPartial(_id: $_id) {
      _id
    }
  }
`;

const DELETE_EMAIL_PARTIAL = gql`
  mutation deleteEmailPartial($_id: String!) {
    deleteEmailPartial(_id: $_id) {
      _id
    }
  }
`;

const EmailEditorOnly = () => {
  const { id } = useParams();
  const [value, setValue] = useState({
    title: '',
    mjmlSource: '',
    folderPath: '',
    errorMessage: ''
  });
  const { data: userData, loading: userLoading } = useQuery(CURRENT_USER);
  const {
    data: getCurrentEmailPartialData,
    loading: getCurrentEmailPartialLoading
  } = useQuery(GET_CURRENT_EMAIL_PARTIAL, {
    variables: {
      _id: id
    }
  });
  const [
    editEmailPartial,
    { loading: editEmailPartialLoading, error: editEmailPartialError }
  ] = useMutation(EDIT_EMAIL_PARTIAL);
  const [duplicateEmailPartial] = useMutation(DUPLICATE_EMAIL_PARTIAL, {
    update(cache, { data: { duplicateEmailPartial } }) {
      window.location = `/email/partials/edit/${duplicateEmailPartial._id}`;
    }
  });
  const [deleteEmailPartial] = useMutation(DELETE_EMAIL_PARTIAL, {
    update(cache, { data: { deleteEmailPartial } }) {
      window.location = '/email/partials/view/page/1';
    }
  });

  console.log(editEmailPartialError);

  const handleEditEmailPartial = () => {
    const { title, mjmlSource, folderPath } = value;
    const organizationId =
      !userLoading &&
      userData.currentUser &&
      userData.currentUser.organizationId;

    editEmailPartial({
      variables: {
        _id: id,
        title,
        mjmlSource,
        folderPath,
        organizationId
      }
    });
  };

  const handleDuplicateEmailPartial = () =>
    duplicateEmailPartial({
      variables: {
        _id: id
      }
    });

  const handleDelete = () =>
    deleteEmailPartial({
      variables: {
        _id: id
      }
    });

  const handleChange = e =>
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });

  useEffect(() => {
    if (getCurrentEmailPartialLoading) return;

    setValue(v => ({
      ...v,
      ...getCurrentEmailPartialData.getCurrentEmailPartial
    }));
  }, [getCurrentEmailPartialData, getCurrentEmailPartialLoading]);

  if (getCurrentEmailPartialLoading) return <Loading />;

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
                    onChange={handleChange}
                    value={value.title || ''}
                  />
                </Grid>
                <Grid item sm={4}>
                  <TextField
                    name="folderPath"
                    placeholder="folderPath"
                    fullWidth
                    onChange={handleChange}
                    value={value.folderPath || ''}
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
                    onClick={handleEditEmailPartial}
                    style={{ marginLeft: 10 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ marginLeft: 10 }}
                    onClick={handleDuplicateEmailPartial}
                  >
                    Duplicate
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    onClick={handleDelete}
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
        <Grid item xs={12}>
          {editEmailPartialLoading && <p>Loading...</p>}
          {editEmailPartialError && <p>Error :( Please try again</p>}
          <CodeMirror
            value={value.mjmlSource}
            options={{
              mode: 'xml',
              theme: 'material',
              lineNumbers: true,
              lineWrapping: true
            }}
            onBeforeChange={(editor, data, value) => {
              setValue(v => ({
                ...v,
                mjmlSource: value
              }));
            }}
            onChange={(editor, data, value) => {
              setValue(v => ({
                ...v,
                mjmlSource: value
              }));
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default EmailEditorOnly;
