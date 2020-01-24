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

class ViewAllEmails extends Component {
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

    if (this.props.getAllEmails.loading) return <Loading />;
    const emails =
      this.props.getAllEmails && this.props.getAllEmails.getAllEmails;
    const count =
      this.props.getEmailsCount && this.props.getEmailsCount.getEmailsCount;

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
                  {renderEmails}
                </Grid>
                {count && count.count > limit ? (
                  <Pagination
                    count={count && count.count}
                    limit={limit}
                    link="/email/view/page/"
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

const getEmailsCount = gql`
  query getEmailsCount($_id: String!) {
    getEmailsCount(_id: $_id) {
      count
    }
  }
`;

const getAllEmails = gql`
  query getAllEmails($_id: String!, $offset: Int, $limit: Int) {
    getAllEmails(_id: $_id, offset: $offset, limit: $limit) {
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
  flowright(
    graphql(currentUser, {
      name: 'currentUser'
    }),
    graphql(getAllEmails, {
      name: 'getAllEmails',
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
    graphql(getEmailsCount, {
      name: 'getEmailsCount',
      options: ownProps => ({
        variables: {
          _id:
            !ownProps.currentUser.loading &&
            ownProps.currentUser.currentUser &&
            ownProps.currentUser.currentUser.organizationId
        }
      })
    })
  )(withApollo(ViewAllEmails))
);
