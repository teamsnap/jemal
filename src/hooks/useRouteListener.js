import { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { useHistory } from 'react-router-dom';

const SET_EMAIL_BEING_EDITED = gql`
  mutation setEmailBeingEdited(
    $_id: String!
    $isBeingEdited: Boolean!
    $currentEditor: String!
  ) {
    setEmailBeingEdited(
      _id: $_id
      isBeingEdited: $isBeingEdited
      currentEditor: $currentEditor
    ) {
      _id
      isBeingEdited
    }
  }
`;

export const useRouteListener = trackingId => {
  const { listen } = useHistory();
  const [prevPath, setPrevPath] = useState('');
  const [setEmailBeingEdited] = useMutation(SET_EMAIL_BEING_EDITED);

  useEffect(() => {
    const unlisten = listen(location => {
      // set path in state
      setPrevPath(location.pathname);
      // call here to access prevPath
      // normally state wouldn't be used this way
      // but we want it to be delayed
      const prevPathSplit = prevPath.split('/');
      const shouldResetEmail =
        prevPathSplit.includes('edit') && prevPathSplit.includes('email');

      shouldResetEmail
        ? setEmailBeingEdited({
            variables: {
              _id: prevPathSplit[3],
              isBeingEdited: false,
              currentEditor: ''
            }
          })`   `
        : console.log('do not fire reset');
    });

    // remember, hooks that add listeners
    // should have cleanup to remove them
    return unlisten;
  }, [prevPath, listen, trackingId]);
};
