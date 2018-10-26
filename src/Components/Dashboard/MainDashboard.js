import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { Link } from 'react-router-dom';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

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
              isDraft={isDraft}
              hasBeenSent={hasBeenSent}
              isApproved={isApproved}
              updatedAt={updatedAt}
              createdAt={createdAt}
              updatedById={updatedById}
              createdById={createdById}
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
            <Typography
              variant="display1"
              component="h1"
              style={styles.heading}
            >
              Welcome {user && user.firstname}
            </Typography>
            <Paper style={styles.paper}>
              <Grid container spacing={24}>
                <Grid item sm={8}>
                  <Typography variant="title" style={styles.heading}>
                    Recent emails
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <div style={styles.flexEnd}>
                    <Link to="/email/create" style={styles.button}>
                      <Button variant="raised" color="primary" size="large">
                        New email
                      </Button>
                    </Link>
                    <Link to="/email/view/page/1" style={styles.button}>
                      <Button variant="raised" size="large">
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