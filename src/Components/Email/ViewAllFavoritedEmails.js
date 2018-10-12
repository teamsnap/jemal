import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql, compose } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

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
              _id={_id}
              title={title}
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
      <div style={styles.root}>
        <Grid container spacing={24}>
          <Grid item sm={12}>
            <Paper style={styles.paper}>
              <Typography
                variant="display1"
                component="h1"
                style={styles.heading}
              >
                Viewing all emails
              </Typography>
              <Paper style={styles.paper}>
                <div style={styles.flexEnd}>
                  <Link to="/email/create">
                    <Button variant="raised" color="primary" size="large">
                      New email
                    </Button>
                  </Link>
                </div>
                <Grid container spacing={24}>
                  {renderEmails}
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
      isDraft
      hasBeenSent
      isApproved
      updatedAt
      favorited
      createdAt
      updatedById
      createdById
      screenshot
      _id
    }
  }
`;

export default withRouter(
  compose(
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
