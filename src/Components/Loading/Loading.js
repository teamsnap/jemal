import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = {
  root: {
    flexGrow: 1,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 60
  },
  paper: {
    padding: 20,
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
  }
};

const LoadingSpinner = () => (
  <div style={styles.root}>
    <Grid container spacing={24}>
      <Grid item sm={12}>
        <Paper style={styles.paper}>
          <Paper style={styles.paper}>
            <CircularProgress color="secondary" />
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  </div>
);

export default LoadingSpinner;
