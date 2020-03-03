import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { Link, useParams } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import EmailCard from '../../Components/Dashboard/EmailCard';
import Pagination from '../../Components/Pagination/Pagination';
import Loading from '../../Components/Loading/Loading';

const limit = 6;

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

const CURRENT_USER = gql`
  query currentUser {
    currentUser {
      _id
      email
      firstname
      organizationId
    }
  }
`;

const GET_EMAILS_COUNT = gql`
  query getEmailsCount($_id: String!) {
    getEmailsCount(_id: $_id) {
      count
    }
  }
`;

const GET_ALL_EMAILS = gql`
  query getAllEmails($_id: String!, $offset: Int, $limit: Int) {
    getAllEmails(_id: $_id, offset: $offset, limit: $limit) {
      title
      _id
      favorited
    }
  }
`;

const ViewAllEmails = () => {
  const { page } = useParams();
  const offset = (page - 1) * limit;
  const { data: userData, loading: userLoading } = useQuery(CURRENT_USER);
  const { data: getAllEmailsData, loading: getAllEmailsLoading } = useQuery(
    GET_ALL_EMAILS,
    {
      variables: {
        skip: !userData,
        _id: userData && userData.currentUser.organizationId,
        offset,
        limit
      }
    }
  );
  const { data: getEmailsCountData, loading: getEmailsCountLoading } = useQuery(
    GET_EMAILS_COUNT,
    {
      variables: {
        skip: !userData,
        _id: userData && userData.currentUser.organizationId
      }
    }
  );

  if (getAllEmailsLoading || userLoading) return <Loading />;
  const emails = !getAllEmailsLoading && getAllEmailsData.getAllEmails;
  const count = !getEmailsCountLoading && getEmailsCountData.getEmailsCount;

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
                  link="/email/view/page/"
                />
              ) : null}
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewAllEmails;
