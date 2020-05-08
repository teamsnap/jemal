import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo';
import { useHistory, useParams } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Loading from '../../Components/Loading/Loading';
import Iframe from './Iframe';
import dataURLtoBlob from '../../modules/dataURLToBlob';

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const AlertBar = (props) => {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert severity={props.severity}>{props.content}</Alert>
    </Snackbar>
  );
};

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

const GET_CURRENT_EMAIL = gql`
  query getCurrentPublicEmail($_id: String!, $orgId: String!) {
    getCurrentPublicEmail(_id: $_id, orgId: $orgId) {
      _id
      title
      mjmlSource
      urlPreview
    }
  }
`;

const CREATE_CURRENT_EMAIL_SCREENSHOT = gql`
  mutation createCurrentEmailScreenshot($_id: String!, $orgId: String) {
    createCurrentEmailScreenshot(_id: $_id, orgId: $orgId) {
      _id
      screenshotDownloadUrl
    }
  }
`;

const PublicEmailView = () => {
  const { id, orgId } = useParams();
  const history = useHistory();
  const [note, setNote] = useState({ open: false, severity: '', content: '' });
  const {
    data: getCurrentEmailData,
    loading: getCurrentEmailLoading,
    error: getCurrentEmailError
  } = useQuery(GET_CURRENT_EMAIL, {
    variables: {
      _id: id,
      orgId
    }
  });
  const [
    createCurrentEmailScreenshot,
    {
      loading: createCurrentEmailScreenshotLoading,
      error: createCurrentEmailScreenshotError
    }
  ] = useMutation(CREATE_CURRENT_EMAIL_SCREENSHOT, {
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
  });

  useEffect(() => {
    setNote({
      open: createCurrentEmailScreenshotError,
      severity: 'error',
      content: 'Whoah! Try again.'
    });
  }, [createCurrentEmailScreenshotError]);

  useEffect(() => {
    setNote({
      open: createCurrentEmailScreenshotLoading,
      severity: 'info',
      content: 'Getting screenshot…'
    });
  }, [createCurrentEmailScreenshotLoading]);

  const handleDownloadScreenshot = () =>
    createCurrentEmailScreenshot({
      variables: {
        _id: id,
        orgId
      }
    });

  const goBack = () => history.goBack();

  if (getCurrentEmailLoading) return <Loading />;
  const email =
    !getCurrentEmailLoading && getCurrentEmailData.getCurrentPublicEmail;

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
                      <Typography variant="h5" component="h1">
                        {email.title}
                      </Typography>
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
                      <Button
                        color="primary"
                        size="small"
                        style={{ marginLeft: 10 }}
                        onClick={handleDownloadScreenshot}
                      >
                        Screenshot
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </div>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <AlertBar
              open={note.open}
              content={note.content}
              severity={note.severity}
            />
            <Iframe
              style={styles.iframe}
              srcDoc={email.urlPreview}
              title={email.title}
            />
          </div>
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

export default PublicEmailView;
