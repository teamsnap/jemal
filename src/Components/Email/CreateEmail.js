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
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import Loading from '../../Components/Loading/Loading';

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
  }
};

const CURRENT_USER = gql`
  query currentUser {
    currentUser {
      _id
      organizationId
    }
  }
`;

const GET_BASE_TEMPLATE_EMAILS = gql`
  query getBaseTemplateEmails($_id: String!, $baseTemplate: Boolean!) {
    getBaseTemplateEmails(_id: $_id, baseTemplate: $baseTemplate) {
      title
      mjmlSource
      _id
    }
  }
`;

const CREATE_EMAIL = gql`
  mutation createEmail(
    $title: String!
    $mjmlSource: String
    $baseTemplate: Boolean
    $duplicatedFrom: String
    $folderPath: String
    $favorited: Boolean
    $isApproved: Boolean
    $hasBeenSent: Boolean
    $isDraft: Boolean
    $organizationId: String!
  ) {
    createEmail(
      title: $title
      mjmlSource: $mjmlSource
      baseTemplate: $baseTemplate
      duplicatedFrom: $duplicatedFrom
      folderPath: $folderPath
      favorited: $favorited
      isApproved: $isApproved
      hasBeenSent: $hasBeenSent
      isDraft: $isDraft
      organizationId: $organizationId
    ) {
      _id
    }
  }
`;

const CreateEmailView = () => {
  const history = useHistory();
  const { data: userData, loading: userLoading } = useQuery(CURRENT_USER);
  const [value, setValue] = useState({
    title: '',
    mjmlSource:
      '<mjml>\n   <mj-body >\n       <mj-section >\n         <mj-column>\n               <mj-text>Empty Templates</mj-text >\n          </mj-column>\n      </mj-section>\n     </mj-body>\n</mjml >\n',
    duplicatedFrom: '',
    folderPath: '',
    favorited: false,
    isApproved: false,
    hasBeenSent: false,
    isDraft: true,
    errorMessage: '',
    baseTemplate: false,
    baseTemplateTitle: ''
  });
  const [createEmail] = useMutation(CREATE_EMAIL, {
    update(cache, { data: { createEmail } }) {
      window.location = `/email/edit/${createEmail._id}`;
    }
  });
  const {
    data: getBaseTemplateEmailsData,
    loading: getBaseTemplateEmailsLoading,
    error: getBaseTemplateEmailsError
  } = useQuery(GET_BASE_TEMPLATE_EMAILS, {
    variables: {
      skip: userLoading && !userData,
      _id: userData && userData.currentUser.organizationId,
      baseTemplate: true
    }
  });

  console.log(getBaseTemplateEmailsError);

  const handleCreateEmail = () => {
    const {
      title,
      mjmlSource,
      baseTemplate,
      duplicatedFrom,
      folderPath,
      favorited,
      isApproved,
      hasBeenSent,
      isDraft
    } = value;
    const organizationId = !userLoading && userData.currentUser.organizationId;

    createEmail({
      variables: {
        title,
        mjmlSource,
        baseTemplate,
        duplicatedFrom,
        folderPath,
        favorited,
        isApproved,
        hasBeenSent,
        isDraft,
        organizationId
      }
    });
  };

  const handleChange = e =>
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });

  const handleMJML = event =>
    setValue(v => ({
      ...v,
      mjmlSource: event.target.value
    }));

  const goBack = () => history.goBack();

  if (getBaseTemplateEmailsLoading) return <Loading />;

  const baseTemplates =
    !getBaseTemplateEmailsLoading &&
    getBaseTemplateEmailsData.getBaseTemplateEmails;

  let renderBaseTemplates;

  if (baseTemplates) {
    renderBaseTemplates = baseTemplates.map(({ title, mjmlSource, _id }) => {
      return (
        <MenuItem key={_id} value={mjmlSource}>
          {title}
        </MenuItem>
      );
    });
  }

  return (
    <div>
      <Card style={styles.card}>
        <CardContent>
          <form action="/">
            <Typography variant="h5">Create a new email</Typography>
            <div style={styles.formControlPad}>
              <TextField
                name="title"
                placeholder="name"
                fullWidth
                onChange={handleChange}
                value={value.title}
              />
            </div>
            <div style={styles.formControlPad}>
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
            <div style={styles.formControlPad}>
              <FormControl fullWidth>
                <InputLabel htmlFor="baseTemplate">Base Templates</InputLabel>
                <Select
                  value={value.mjmlSource}
                  onChange={handleMJML}
                  inputProps={{
                    name: 'baseTemplateTitle',
                    id: 'baseTemplate'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {renderBaseTemplates}
                </Select>
              </FormControl>
            </div>
          </form>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleCreateEmail}
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

export default CreateEmailView;
