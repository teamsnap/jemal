import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import HeartIcon from '../Icons/HeartIcon';

const styles = {
  card: {
    marginTop: 20,
    position: 'relative',
    marginRight: 20
  },
  cardContent: {
    position: 'relative'
  },
  icon: {
    position: 'absolute',
    left: 20,
    top: 20
  },
  image: {
    display: 'block'
  },
  imageContainer: {
    minHeight: 205,
    maxHeight: 205,
    marginLeft: -24,
    marginRight: -24,
    marginTop: -16,
    marginBottom: 16,
    overflow: 'hidden'
  },
  loadingContainer: {
    overflow: 'hidden',
    minHeight: 205,
    maxHeight: 205,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    marginLeft: -24,
    marginRight: -24,
    marginTop: -16,
    marginBottom: 16
  },
  link: {
    textDecoration: 'none',
    color: '#3f51b5'
  }
};

const GET_CURRENT_EMAIL_SCREENSHOT = gql`
  query getCurrentEmailScreenshot($_id: String!) {
    getCurrentEmailScreenshot(_id: $_id) {
      image
    }
  }
`;

const GET_EMAIL_BEING_EDITED = gql`
  query getEmailBeingEdited($_id: String!) {
    getEmailBeingEdited(_id: $_id) {
      isBeingEdited
    }
  }
`;

const EmailCard = ({
  favorited,
  needsImage,
  link,
  title,
  _id,
  duplicateEmail,
  duplicateEmailPartial
}) => {
  const { data, loading } = useQuery(GET_CURRENT_EMAIL_SCREENSHOT, {
    variables: {
      _id
    }
  });
  const {
    startPolling,
    stopPolling,
    data: emailBeingEditedData,
    loading: emailBeingEditedLoading
  } = useQuery(GET_EMAIL_BEING_EDITED, {
    variables: {
      _id
    }
  });

  useEffect(() => {
    startPolling(6000); // will be called only once
    return stopPolling; // just return cleanup function without making new one
  }, []);

  const image = data && data.getCurrentEmailScreenshot.image;
  const isBeingEdited =
    !emailBeingEditedLoading &&
    emailBeingEditedData &&
    emailBeingEditedData.getEmailBeingEdited.isBeingEdited;

  // instead of pulling isBeingEdited from the top level
  // lets setInterval from the cards and check here

  // setInterval(() => {

  // })

  if (emailBeingEditedLoading)
    return (
      <Grid item sm={4}>
        <CardContent style={styles.cardContent}>
          <div style={styles.loadingContainer}>
            <CircularProgress color="secondary" />
          </div>
        </CardContent>
      </Grid>
    );

  return (
    <Grid item sm={4}>
      <Card style={{ ...styles.card, opacity: isBeingEdited ? 0.45 : 1 }}>
        <CardContent style={styles.cardContent}>
          {favorited ? <HeartIcon color="primary" style={styles.icon} /> : null}
          {needsImage ? (
            !loading ? (
              <div style={styles.imageContainer}>
                {isBeingEdited ? (
                  <img src={image} alt={title} style={styles.image} />
                ) : (
                  <Link to={link}>
                    <img src={image} alt={title} style={styles.image} />
                  </Link>
                )}
              </div>
            ) : (
              <div style={styles.loadingContainer}>
                <CircularProgress color="secondary" />
              </div>
            )
          ) : null}
          {isBeingEdited ? (
            <Typography variant="h6">{title} Locked</Typography>
          ) : (
            <Link to={link} style={styles.link}>
              <Typography variant="h6">{title}</Typography>
            </Link>
          )}
          {isBeingEdited ? 'isBeingEdited' : 'isNotBeingEdited'}
        </CardContent>
        {isBeingEdited ? (
          <CardActions>
            isBeingEdited <Link to={link}>{link}</Link>
          </CardActions>
        ) : (
          <CardActions>
            <Link to={link}>
              <Button variant="contained" color="primary" size="small">
                Edit
              </Button>
            </Link>
            {needsImage ? (
              <Button
                variant="contained"
                size="small"
                onClick={() => duplicateEmail({ variables: { _id } })}
              >
                Duplicate
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={() => duplicateEmailPartial({ variables: { _id } })}
              >
                Duplicate partial
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

export default EmailCard;
