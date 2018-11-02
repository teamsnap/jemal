import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import EmailCard from './EmailCard';

class MainDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      success: '',
      errorMessage: ''
    };
  }

  render() {
    const styles = {
      heading: {
        marginBottom: 20
      },
      button: {
        marginRight: 20,
        textDecoration: 'none'
      },
      flexEnd: {
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-end'
      },
      paper: {
        padding: 20
      }
    };

    const { user, emails } = this.props;
    let renderEmails;

    if (emails) {
      renderEmails = emails.map(
        ({
          title,
          isDraft,
          hasBeenSent,
          isApproved,
          updatedAt,
          createdAt,
          updatedById,
          createdById,
          screenshot,
          _id,
          favorited
        }) => {
          return (
            <EmailCard
              key={_id}
              title={title}
              _id={_id}
              link={`/email/edit/${_id}`}
              email={true}
              image={screenshot}
              favorited={favorited}
            />
          );
        }
      );
    }

    return (
      <Grid container spacing={24}>
        <Grid item sm={12}>
          <Paper style={styles.paper}>
            <Typography variant="h4" style={styles.heading}>
              Welcome {user && user.firstname}
            </Typography>
            <Paper style={styles.paper}>
              <Grid container spacing={24}>
                <Grid item sm={6}>
                  <Typography variant="h6" style={styles.heading}>
                    Recent emails
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <div style={styles.flexEnd}>
                    <Link to="/email/create" style={styles.button}>
                      <Button variant="contained" color="primary" size="large">
                        New email
                      </Button>
                    </Link>
                    <Link to="/email/view/page/1" style={styles.button}>
                      <Button variant="contained" size="large">
                        View all emails
                      </Button>
                    </Link>
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={24}>
                {renderEmails}
              </Grid>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withApollo(MainDashboard);
