import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, ApolloLink, HttpLink, from, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import App from './App';
import 'normalize.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import Auth from './modules/Auth';

const uri = process.env.REACT_APP_GRAPHQL_URI || 'http://localhost:4100/graphql';
const httpLink = new HttpLink({ uri });

const authLink = new ApolloLink((operation, forward) => {
  const token = Auth.getToken();
  if (token !== null) {
      operation.setContext(() => ({
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }));
  } else {
      operation.setContext(() => ({
        headers: {}
      }));
  }

  return forward(operation);
});

const cache = new InMemoryCache();

// Pass your GraphQL endpoint to uri
const client = new ApolloClient({
  link: from([authLink, httpLink ]),
  cache
});

const ApolloApp = AppComponent => (
  <ApolloProvider client={client}>
    <AppComponent />
  </ApolloProvider>
);

render(ApolloApp(App), document.getElementById('root'));
