import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const styles = {
  card: {
    maxWidth: 400,
    margin: '0 auto'
  },
  formControl: {
    minWidth: 120
  },
  formControlPad: {
    marginTop: 20
  },
  selectEmpty: {}
};

const CURRENT_USER = gql`
  query currentUser {
    currentUser {
      _id
      organizationId
    }
  }
`;

const CREATE_EMAIL_PARTIAL = gql`
  mutation createEmailPartial(
    $title: String!
    $mjmlSource: String
    $folderPath: String
    $organizationId: String!
  ) {
    createEmailPartial(
      title: $title
      mjmlSource: $mjmlSource
      folderPath: $folderPath
      organizationId: $organizationId
    ) {
      _id
    }
  }
`;

const CreateEmailPartialView = () => {
  const history = useHistory();
  const [value, setValue] = useState({
    title: '',
    mjmlSource: '<!-- code goes here -->\n',
    folderPath: '',
    errorMessage: ''
  });
  const { data: userData, loading: userLoading } = useQuery(CURRENT_USER);
  const [createEmailPartial] = useMutation(CREATE_EMAIL_PARTIAL, {
    update(cache, { data: { createEmailPartial } }) {
      window.location = `/email/partials/edit/${createEmailPartial._id}`;
    }
  });

  const handleCreateEmailPartial = () => {
    const { title, mjmlSource, folderPath } = value;
    const organizationId = !userLoading && userData.currentUser.organizationId;

    createEmailPartial({
      variables: {
        title,
        mjmlSource,
        folderPath,
        organizationId
      }
    });
  };

  const handleChange = e =>
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });

  const goBack = () => history.goBack();

  return (
    <div>
      <Card style={styles.card}>
        <CardContent>
          <form action="/">
            <Typography variant="h5">
              Create a new email template partial
            </Typography>
            <div style={styles.formControlPad}>
              <TextField
                floatingLabelText="title"
                name="title"
                placeholder="title"
                value={value.title}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div>
              <TextField
                floatingLabelText="folderPath"
                type="folderPath"
                name="folderPath"
                placeholder="folderPath"
                value={value.folderPath}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </form>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleCreateEmailPartial}
          >
            Create
          </Button>
          <Button variant="contained" size="small" onClick={goBack}>
            Cancel
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default CreateEmailPartialView;
