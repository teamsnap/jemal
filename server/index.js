require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('express-jwt');

const typeDefs = require('./data/schema');
const resolvers = require('./data/resolvers');

const app = express();
const gqlPath = '/';

if (!process.env.MONGO_URI) throw new Error('You must provide a MongoLab URI');

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) console.error('Could not connect to MongoDB');
  }
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    user: req.user,
    appUrl:
      req.hostname === 'localhost'
        ? `http://localhost:3000/`
        : 'https://ts-mar-email.now.sh/'
  }),
  path: gqlPath,
  introspection: true
});

app.use(
  gqlPath,
  jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
    algorithms: ['sha1', 'RS256', 'HS256']
  })
);
server.applyMiddleware({ app, path: gqlPath });

app.listen();

module.exports = app;
