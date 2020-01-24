import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import flowright from 'lodash.flowright';
import { Link, withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import EmailCard from '../../Components/Dashboard/EmailCard';
import Pagination from '../../Components/Pagination/Pagination';
import Loading from '../../Components/Loading/Loading';

const limit = 6;

class ViewAllFavoritedEmails extends Component {
  render() {
    const styles = {
      root: {
        flexGrow: 1,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 60
      },
      heading: {
        marginBottom: 20
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

    if (this.props.getFavoritedEmails.loading) return <Loading />;
    const emails =
      this.props.getFavoritedEmails &&
      this.props.getFavoritedEmails.getFavoritedEmails;
    const count =
      this.props.getFavoritedEmailsCount &&
      this.props.getFavoritedEmailsCount.getFavoritedEmailsCount;

    return (
      <div style={styles.root}>
        <Grid container spacing={24}>
          <Grid item sm={12}>
            <Paper style={styles.paper}>
              <Typography variant="h4" style={styles.heading}>
                Viewing all emails
              </Typography>
              <Paper style={styles.paper}>
                <div style={styles.flexEnd}>
                  <Link to="/email/create">
                    <Button variant="contained" color="primary" size="large">
                      New email
                    </Button>
                  </Link>
                </div>
                <Grid container spacing={24}>
                  {emails &&
                    emails.map(({ title, _id, favorited }) => (
                      <EmailCard
                        key={_id}
                        title={title}
                        _id={_id}
                        link={`/email/edit/${_id}`}
                        email={true}
                        favorited={favorited}
                        needsImage={true}
                      />
                    ))}
                </Grid>
                {count && count.count > limit ? (
                  <Pagination
                    count={count && count.count}
                    limit={limit}
                    link="/email/favorited/view/page/"
                  />
                ) : null}
              </Paper>
            </Paper>
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
      email
      firstname
      organizationId
    }
  }
`;

const getFavoritedEmailsCount = gql`
  query getFavoritedEmailsCount($_id: String!) {
    getFavoritedEmailsCount(_id: $_id) {
      count
    }
  }
`;

const getFavoritedEmails = gql`
  query getFavoritedEmails($_id: String!, $offset: Int, $limit: Int) {
    getFavoritedEmails(_id: $_id, offset: $offset, limit: $limit) {
      title
      _id
      favorited
    }
  }
`;

export default withRouter(
  flowright(
    graphql(currentUser, {
      name: 'currentUser'
    }),
    graphql(getFavoritedEmails, {
      name: 'getFavoritedEmails',
      options: ownProps => ({
        variables: {
          _id:
            !ownProps.currentUser.loading &&
            ownProps.currentUser.currentUser &&
            ownProps.currentUser.currentUser.organizationId,
          offset: (ownProps.match.params.page - 1) * limit,
          limit
        }
      })
    }),
    graphql(getFavoritedEmailsCount, {
      name: 'getFavoritedEmailsCount',
      options: ownProps => ({
        variables: {
          _id:
            !ownProps.currentUser.loading &&
            ownProps.currentUser.currentUser &&
            ownProps.currentUser.currentUser.organizationId
        }
      })
    })
  )(withApollo(ViewAllFavoritedEmails))
);
