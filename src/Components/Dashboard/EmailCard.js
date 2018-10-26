import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import SvgIcon from 'material-ui/SvgIcon';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';

function HeartIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </SvgIcon>
  );
}

class EmailCard extends Component {
  constructor(props) {
    super(props);
    this.duplicate = this.duplicate.bind(this);

    this.state = {
      errorMessage: ''
    };
  }

  duplicate() {
    if (this.props.email) {
      this.props
        .duplicateEmail({
          variables: {
            _id: this.props._id
          }
        })
        .then(data => {
          this.props.client.resetStore();
        })
        .catch(error => {
          console.error(error);
          this.setState({
            errorMessage: error.message.split(':')[1]
          });
        });
    } else {
      this.props
        .duplicateEmailPartial({
          variables: {
            _id: this.props._id
          }
        })
        .then(data => {
          this.props.client.resetStore();
        })
        .catch(error => {
          console.error(error);
          this.setState({
            errorMessage: error.message.split(':')[1]
          });
        });
    }
  }

  render() {
    const styles = {
      card: {
        marginTop: 20,
        position: 'relative'
      },
      heading: {
        marginBottom: 20
      },
      icon: {
        position: 'absolute',
        left: 20,
        top: 20
      },
      image: {
        marginLeft: -24,
        marginRight: -24,
        marginTop: -16,
        display: 'block',
        marginBottom: 16
      }
    };

    if (this.props.loading) return null;
    let renderEmail;
    let renderImage;

    if (this.props.email) {
      renderImage = (
        <Link to={this.props.link}>
          <img
            src={this.props.image}
            alt={this.props.title}
            style={styles.image}
          />
        </Link>
      );
    }

    return (
      <Grid item sm={4}>
        <Card style={styles.card}>
          <CardContent style={styles.card}>
            {this.props.favorited ? (
              <HeartIcon color="primary" style={styles.icon} />
            ) : null}
            {renderImage}
            <Link to={this.props.link}>
              <Typography variant="title" style={styles.heading}>
                {this.props.title}
              </Typography>
            </Link>
            {renderEmail}
          </CardContent>
          <CardActions>
            <Link to={this.props.link}>
              <Button variant="raised" color="primary" size="small">
                Edit
              </Button>
            </Link>
            <Button variant="raised" size="small" onClick={this.duplicate}>
              Duplicate
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

const duplicateEmail = gql`
  mutation duplicateEmail($_id: String!) {
    duplicateEmail(_id: $_id) {
      _id
    }
  }
`;

const duplicateEmailPartial = gql`
  mutation duplicateEmailPartial($_id: String!) {
    duplicateEmailPartial(_id: $_id) {
      _id
    }
  }
`;

const deleteEmailPartial = gql`
  mutation deleteEmailPartial($_id: String!) {
    deleteEmailPartial(_id: $_id) {
      _id
    }
  }
`;

export default compose(
  graphql(duplicateEmail, {
    name: 'duplicateEmail'
  }),
  graphql(duplicateEmailPartial, {
    name: 'duplicateEmailPartial'
  }),
  graphql(deleteEmailPartial, {
    name: 'deleteEmailPartial'
  })
)(withApollo(EmailCard));
