import express from 'express';
import { ApolloServer } from "apollo-server-express";
import mongoose from 'mongoose';
import dotenv from 'dotenv-flow';
import jwt from 'express-jwt';
import path from 'path';

import typeDefs from './data/schema';
import resolvers from './data/resolvers';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config()

const app = express();
const gqlPath = "/graphql";
const port = process.env.PORT || 4000;

if (!process.env.MONGO_URI) throw new Error('You must provide a MongoLab URI');

const mongo = mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true },
  err => {
    if (err) console.error("Could not connect to MongoDB");
  }
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    user: req.user
  })
});

app.use('/emails', express.static(path.join(__dirname, 'emails')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(
  gqlPath,
  jwt({ secret: process.env.JWT_SECRET, credentialsRequired: false })
);

server.applyMiddleware({ app, gqlPath });

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
);
