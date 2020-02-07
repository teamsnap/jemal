import React from 'react';
import gql from 'graphql-tag';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';

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

const GET_ALL_EMAIL_PARTIALS = gql`
  query getAllEmailPartials($_id: String!, $offset: Int, $limit: Int) {
    getAllEmailPartials(_id: $_id, offset: $offset, limit: $limit) {
      title
      _id
    }
  }
`;

const GET_EMAIL_PARTIALS_COUNT = gql`
  query getEmailPartialsCount($_id: String!) {
    getEmailPartialsCount(_id: $_id) {
      count
    }
  }
`;

const DUPLICATE_EMAIL_PARTIAL = gql`
  mutation duplicateEmailPartial($_id: String!) {
    duplicateEmailPartial(_id: $_id) {
      title
      _id
    }
  }
`;

const ViewAllPartials = () => {
  const { page } = useParams();
  const history = useHistory();
  const offset = (page - 1) * limit;
  const { data: data_user } = useQuery(CURRENT_USER);
  const { data: data_partials, loading: loading_partials } = useQuery(
    GET_ALL_EMAIL_PARTIALS,
    {
      variables: {
        skip: !data_user,
        _id: data_user && data_user.currentUser.organizationId,
        offset,
        limit
      }
    }
  );
  const { data: data_count, loading: loading_count } = useQuery(
    GET_EMAIL_PARTIALS_COUNT,
    {
      variables: {
        skip: !data_user,
        _id: data_user && data_user.currentUser.organizationId
      }
    }
  );
  const [duplicateEmailPartial] = useMutation(DUPLICATE_EMAIL_PARTIAL, {
    update(cache, { data: { duplicateEmailPartial } }) {
      const { getAllEmailPartials } = cache.readQuery({
        query: GET_ALL_EMAIL_PARTIALS,
        variables: {
          skip: !data_user,
          _id: data_user && data_user.currentUser.organizationId,
          offset: 0,
          limit: 6
        }
      });

      getAllEmailPartials.pop();

      cache.writeQuery({
        query: GET_ALL_EMAIL_PARTIALS,
        variables: {
          skip: !data_user,
          _id: data_user && data_user.currentUser.organizationId,
          offset: 0,
          limit: 6
        },
        data: {
          getAllEmails: getAllEmailPartials.unshift(duplicateEmailPartial)
        }
      });

      history.push(`/email/partials/edit/${duplicateEmailPartial._id}`);
    }
  });

  if (loading_partials) return <Loading />;
  const emailPartials =
    !loading_partials && data_partials && data_partials.getAllEmailPartials;
  const count =
    !loading_count && data_count && data_count.getEmailPartialsCount;

  return (
    <div style={styles.root}>
      <Grid container spacing={24}>
        <Grid item sm={12}>
          <Paper style={styles.paper}>
            <Typography variant="h4">Viewing all email partials</Typography>
            <Paper style={styles.paper}>
              <Link to="/email/partial/create">
                <Button variant="contained" color="primary" size="large">
                  New email partial
                </Button>
              </Link>
              <Grid container spacing={24}>
                {emailPartials &&
                  emailPartials.map(({ title, _id }) => (
                    <EmailCard
                      key={_id}
                      _id={_id}
                      title={title}
                      link={`/email/partials/edit/${_id}`}
                      needsImage={false}
                      history={history}
                      duplicateEmailPartial={duplicateEmailPartial}
                    />
                  ))}
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
};

export default ViewAllPartials;
