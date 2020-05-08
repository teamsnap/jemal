import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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

const EmailCard = ({
  favorited,
  needsImage,
  link,
  title,
  _id,
  duplicateEmail,
  duplicateEmailPartial,
  organizationId
}) => {
  const [feedback, setFeedback] = useState(false);
  const { data, loading } = useQuery(GET_CURRENT_EMAIL_SCREENSHOT, {
    variables: {
      _id
    }
  });

  const image = data && data.getCurrentEmailScreenshot.image;

  return (
    <Grid item sm={4}>
      <Card style={styles.card}>
        <CardContent style={styles.cardContent}>
          {favorited ? <HeartIcon color="primary" style={styles.icon} /> : null}
          {needsImage ? (
            !loading ? (
              <div style={styles.imageContainer}>
                <Link to={link}>
                  <img src={image} alt={title} style={styles.image} />
                </Link>
              </div>
            ) : (
              <div style={styles.loadingContainer}>
                <CircularProgress color="secondary" />
              </div>
            )
          ) : null}
          <Link to={link} style={styles.link}>
            <Typography variant="h6">{title}</Typography>
          </Link>
        </CardContent>
        <CardActions>
          <Link to={link}>
            <Button variant="contained" color="primary" size="small">
              Edit
            </Button>
          </Link>
          {needsImage ? (
            <>
              <Button
                variant="contained"
                size="small"
                onClick={() => duplicateEmail({ variables: { _id } })}
              >
                Duplicate
              </Button>
              <CopyToClipboard
                text={`${window.location.origin}/email/public/${organizationId}/${_id}`}
                onCopy={() => {
                  setFeedback(true);

                  setTimeout(() => {
                    setFeedback(false);
                  }, 3000);
                }}
              >
                <Button color="primary" size="small" style={{ marginLeft: 10 }}>
                  {feedback ? 'Copied!' : 'Share'}
                </Button>
              </CopyToClipboard>
            </>
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
      </Card>
    </Grid>
  );
};

export default EmailCard;
