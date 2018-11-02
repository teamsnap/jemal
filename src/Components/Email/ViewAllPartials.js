import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql, compose } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import EmailCard from '../../Components/Dashboard/EmailCard';
import Pagination from '../../Components/Pagination/Pagination';
import Loading from '../../Components/Loading/Loading';

const limit = 6;

class ViewAllPartials extends Component {
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
        padding: 20
      }
    };

    if (this.props.getAllEmailPartials.loading) return <Loading />;
    const emailPartials =
      this.props.getAllEmailPartials &&
      this.props.getAllEmailPartials.getAllEmailPartials;
    const count =
      this.props.getEmailPartialsCount &&
      this.props.getEmailPartialsCount.getEmailPartialsCount;

    let renderEmailPartials;

    if (emailPartials) {
      renderEmailPartials = emailPartials.map(({ title, _id }) => {
        return (
          <EmailCard
            key={_id}
            _id={_id}
            title={title}
            link={`/email/partials/edit/${_id}`}
          />
        );
      });
    }

    return (
      <div style={styles.root}>
        <Grid container spacing={24}>
          <Grid item sm={12}>
            <Paper style={styles.paper}>
              <Typography variant="display1" component="h1">
                Viewing all email partials
              </Typography>
              <Paper style={styles.paper}>
                <Link to="/email/partial/create">
                  <Button variant="raised" color="primary" size="large">
                    New email partial
                  </Button>
                </Link>
                <Grid container spacing={24}>
                  {renderEmailPartials}
                </Grid>
                {count && count.count > limit ? (
                  <Pagination
                    count={count && count.count}
                    limit={limit}
                    link="/email/partials/view/page/"
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

const getAllEmailPartials = gql`
  query getAllEmailPartials($_id: String!, $offset: Int, $limit: Int) {
    getAllEmailPartials(_id: $_id, offset: $offset, limit: $limit) {
      title
      _id
    }
  }
`;

const getEmailPartialsCount = gql`
  query getEmailPartialsCount($_id: String!) {
    getEmailPartialsCount(_id: $_id) {
      count
    }
  }
`;

export default withRouter(
  compose(
    graphql(currentUser, {
      name: 'currentUser'
    }),
    graphql(getAllEmailPartials, {
      name: 'getAllEmailPartials',
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
    graphql(getEmailPartialsCount, {
      name: 'getEmailPartialsCount',
      options: ownProps => ({
        variables: {
          _id:
            !ownProps.currentUser.loading &&
            ownProps.currentUser.currentUser &&
            ownProps.currentUser.currentUser.organizationId
        }
      })
    })
  )(withApollo(ViewAllPartials))
);
