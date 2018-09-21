import React, { Component } from "react";
import gql from "graphql-tag";
import { withApollo, graphql, compose } from "react-apollo";
import { Link } from 'react-router-dom';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from "material-ui/Button";

import EmailCard from '../Components/Dashboard/EmailCard';
import Loading from '../Components/Loading/Loading';

class Dashboard extends Component {
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

        if (this.props.getAllEmails.loading) return <Loading />;
        const user = this.props.currentUser.currentUser && this.props.currentUser.currentUser;
        const emails = this.props.getAllEmails && this.props.getAllEmails.getAllEmails;


        console.log(user)

        let renderEmails

        if (emails) {
            renderEmails = emails.map( ( { title, isDraft, hasBeenSent, isApproved, updatedAt, createdAt, updatedById, createdById, screenshot, _id, favorited } )=>{
                return <EmailCard key={_id} title={title} _id={_id} link={`/email/edit/${_id}`} email={true} isDraft={isDraft} hasBeenSent={hasBeenSent} isApproved={isApproved} updatedAt={updatedAt} createdAt={createdAt} updatedById={updatedById} createdById={createdById} image={screenshot} favorited={favorited} />
            });
        }

        return (
            <div style={styles.root}>
              <Grid container spacing={24}>
                <Grid item sm={12}>
                  <Paper style={styles.paper}>
                    <Typography variant="display1" component="h1" style={styles.heading}>Welcome {user && user.firstname}</Typography>
                    <Paper style={styles.paper}>
                        <Grid container spacing={24}>
                          <Grid item sm={8}>
                                <Typography variant="title" style={styles.heading}>Recent emails</Typography>
                            </Grid>
                            <Grid item sm={4}>
                              <div style={styles.flexEnd}>
                                <Link to="/email/create" style={styles.button}><Button variant="raised" color="primary" size="large">New email</Button></Link>
                                <Link to="/email/view/page/1" style={styles.button}><Button variant="raised" size="large">View all emails</Button></Link>
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
    query getAllEmails($_id: String! $offset: Int $limit: Int) {
        getAllEmails(_id: $_id offset: $offset limit: $limit) {
            title
            isDraft
            hasBeenSent
            isApproved
            favorited
            updatedAt
            createdAt
            updatedById
            createdById
            screenshot
            _id
        }
    }
`;

export default compose(
    graphql(currentUser, {
        name: "currentUser"
    }),
    graphql(getAllEmails, {
        name: "getAllEmails",
        options: (ownProps) => ({
            variables: {
                _id: !ownProps.currentUser.loading && ownProps.currentUser.currentUser && ownProps.currentUser.currentUser.organizationId,
                offset: 0,
                limit: 6
            },
            forceRefetch: true
        })
    }),
    graphql(getEmailsCount, {
        name: "getEmailsCount",
        options: (ownProps) => ({
            variables: {
                _id: !ownProps.currentUser.loading && ownProps.currentUser.currentUser && ownProps.currentUser.currentUser.organizationId
            },
            forceRefetch: true
        })
    })
)(withApollo(Dashboard));
