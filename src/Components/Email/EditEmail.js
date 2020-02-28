import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery, useApolloClient } from 'react-apollo';
import { useHistory, useParams } from 'react-router-dom';

import './EditEmail.css';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { Controlled as CodeMirror } from 'react-codemirror2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'codemirror/mode/xml/xml';
import { countColumn } from 'codemirror';

import Loading from '../../Components/Loading/Loading';
import Iframe from './Iframe';
import dataURLtoBlob from '../../modules/dataURLtoBlob';

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

const CURRENT_USER = gql`
  query currentUser {
    currentUser {
      _id
      organizationId
    }
  }
`;

const GET_CURRENT_EMAIL = gql`
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

const EDIT_EMAIL = gql`
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

const DUPLICATE_EMAIL = gql`
  mutation duplicateEmail($_id: String!) {
    duplicateEmail(_id: $_id) {
      _id
    }
  }
`;

const DELETE_EMAIL = gql`
  mutation deleteEmail($_id: String!) {
    deleteEmail(_id: $_id) {
      _id
    }
  }
`;

const CREATE_CURRENT_EMAIL_SCREENSHOT = gql`
  mutation createCurrentEmailScreenshot($_id: String!) {
    createCurrentEmailScreenshot(_id: $_id) {
      _id
      screenshotDownloadUrl
    }
  }
`;

const EditEmailView = () => {
  const { id } = useParams();
  const history = useHistory();
  const client = useApolloClient();
  const [value, setValue] = useState({
    title: '',
    mjmlSource: '',
    baseTemplate: false,
    duplicatedFrom: '',
    folderPath: '',
    favorited: false,
    isApproved: false,
    hasBeenSent: false,
    isDraft: false,
    copied: false
  });
  const { data: userData, loading: userLoading } = useQuery(CURRENT_USER);
  const {
    data: getCurrentEmailData,
    loading: getCurrentEmailLoading,
    error: getCurrentEmailError
  } = useQuery(GET_CURRENT_EMAIL, {
    variables: {
      _id: id
    }
  });
  const [
    editEmail,
    { loading: editEmailLoading, error: editEmailError }
  ] = useMutation(EDIT_EMAIL);
  const [duplicateEmail] = useMutation(DUPLICATE_EMAIL, {
    update(cache, { data: { duplicateEmail } }) {
      window.location = `/email/edit/${duplicateEmail._id}`;
    }
  });
  const [deleteEmail] = useMutation(DELETE_EMAIL, {
    update(cache, { data: { deleteEmail } }) {
      window.location = '/';
    }
  });
  const [createCurrentEmailScreenshot] = useMutation(
    CREATE_CURRENT_EMAIL_SCREENSHOT,
    {
      update(cache, { data: { createCurrentEmailScreenshot } }) {
        const blob = dataURLtoBlob(
          createCurrentEmailScreenshot.screenshotDownloadUrl
        );

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'download.jpeg';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }
  );

  useEffect(() => {
    if (getCurrentEmailLoading) return;

    setValue(v => ({
      ...v,
      ...getCurrentEmailData.getCurrentEmail
    }));
  }, [getCurrentEmailData, getCurrentEmailLoading]);

  const handleDuplicate = () =>
    duplicateEmail({
      variables: {
        _id: id
      }
    });

  const handleDownloadScreenshot = () =>
    createCurrentEmailScreenshot({
      variables: {
        _id: id
      }
    });

  const handleDelete = () =>
    deleteEmail({
      variables: {
        _id: id
      }
    });

  const handleEditEmail = () => {
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
    } = value;
    const organizationId = !userLoading && userData.currentUser.organizationId;

    editEmail({
      variables: {
        _id: id,
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
    });
  };

  const handleChange = e =>
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });

  const goBack = () => history.goBack();

  if (getCurrentEmailLoading) return <Loading />;
  const email = !getCurrentEmailLoading && getCurrentEmailData.getCurrentEmail;

  return (
    <>
      {!getCurrentEmailError ? (
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
                        onChange={handleChange}
                        value={value.title || ''}
                      />
                    </Grid>
                    <Grid
                      item
                      sm={4}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginLeft: 'auto'
                      }}
                    >
                      {value.copied ? (
                        <span
                          onClick={() =>
                            setValue(v => ({ ...v, copied: false }))
                          }
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
                        onClick={handleEditEmail}
                      >
                        Save
                      </Button>
                      <CopyToClipboard
                        text={email.urlPreview}
                        onCopy={() => setValue(v => ({ ...v, copied: true }))}
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
                        onClick={handleDownloadScreenshot}
                      >
                        Screenshot
                      </Button>
                      <Button
                        size="small"
                        onClick={handleDuplicate}
                        style={{ marginLeft: 10 }}
                      >
                        Duplicate
                      </Button>
                      <Button
                        size="small"
                        color="secondary"
                        onClick={handleDelete}
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
              {editEmailLoading && <p>Loading...</p>}
              {editEmailError && <p>Error :( Please try again</p>}
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
                srcDoc={email.urlPreview}
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
                      Error:{' '}
                      {getCurrentEmailError &&
                        getCurrentEmailError.error.message.split(':')[1]}
                    </Typography>
                    <Button variant="contained" size="small" onClick={goBack}>
                      Go back
                    </Button>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      )}
    </>
  );
};

export default EditEmailView;
