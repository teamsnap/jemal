import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

class LoadingSpinner extends Component {
  render() {
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

    return (
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
  }
}

export default LoadingSpinner;
