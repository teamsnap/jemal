# JEMAL
###### Jolly Email Management Application
The purpose of this application is to decouple the need to create emails inside of an ESP (Email Sending/Service Provider). This was born of out becoming tired of having to manage the creation of emails that was sent across three plus ESPs. It is a Graphql and React application that provides previews and CRUD operations leveraging the MJML email framework.

![A hefty gif of the JEMAL app](app.gif)

##### Technologies:
* MJML v4 (Email template language)
* React bootstrapped through Create React App
* Apollo
    * Client
    * Server
* MongoDB
* Mongoose to work with MongoDB
* Nodemailer
* Node Foreman to run server and client app

See their docs for more information

## Getting started

You will need your own mongodb setup, suggest the sandbox plan on mLab. You will configure that in .env.
Email transport is through nodemailer, you will configure that through .env as well.

With git:
```bash
git clone https://github.com/teamsnap/jemal.git
cd jemal
npm install
touch .env.development.local
npm start
```

With Docker:
Coming soon to a branch near you!

## .env setup
Refer to Create React App for the different type of .env filenames it supports; the server will supoort those out of the box too.

```
NODE_ENV=development

# CLIENT
REACT_APP_GRAPHQL_URI=http://localhost:4100/graphql

# SERVER
SERVER_PORT=4000
MONGO_URI= <your mongodb connection>
JWT_SECRET=super-secret
NODEMAILER_SERVICE= <your nodemailer service>
NODEMAILER_USER= <your nodemailer user>
NODEMAILER_PASS= <your nodemailer pass>
APP_URL=http://localhost:4100
```

## Client application

#### File structure
Client app is housed in the `src` folder

The CRA index.html is in the `public` folder, along with anything you need exposed, well, to the public

General components go into the `src/Components` folder

Create your routes in the `src/routes` folder

Pull them into the file `App.js`. If you need auth, use the `<PrivateRoute />` component, that will handle the hardwork for you.

Follow the Apollo best practices, it handles all the caching, data request, etc for us :)

Using material-ui to handle the pretty parts

## Server application

#### File structure
Server code is in the `server` folder

`server/components` holds custom MJML components that you may want to build out

`server/data` holds (organized by feature):
* Mongoose Models
* Apollo Graphql resolvers
* Apollo Graphql Schema

`server/helpers` contains shared code, like the email transport, email render function, and saving the email template partial to the file system.

`server/public` contains, well goodies for the public

The server will output two folders to work, a hidden from VCS folder in `server` named `emails` and one in the root of project named `emails`. This needs to be refactored, but the purpose will be the same, it is the holding space for the compiled MJML files and the screenshots taken by the system. The resolver needs to read the MJML files to generate the html for the iframe preview and copy to clipboard function.

#### Example usage

Note: you can pull the user off of `context`. That has been configured in `server.js`.

`models/EmailPartial.js`
```
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const EmailPartialSchema = new Schema({
    title: { type: String },
    createdAt: { type: Date, default: Date.now },
    createdById: { type: String },
    updatedAt: { type: Date, default: Date.now },
    updatedById: { type: String },
    folderPath: { type: String },
    mjmlSource: { type: String },
    organizationId: { type: String },
});

const EmailPartial =  mongoose.model('EmailPartial', EmailPartialSchema);

export default EmailPartial;
```

`resolver/EmailPartial.js`
```
import { EmailPartial } from '../models'
import { saveTemplatePartial } from '../../helpers';

const EmailPartialResolver = {
  Query: {
      ...
      getCurrentEmailPartial: async (root, { _id }, { user }) => {

        if (!user) throw new Error('Must be logged in');
        if (!_id) throw new Error('Must have email partial id');

        const emailPartialsFound = await EmailPartial.findOne({ _id }, (err, org) => { if (err) console.error(err) });

        return emailPartialsFound;
      }
    },
  Mutation: {
    ...
    deleteEmailPartial: async (root, { _id }, { user }) => {
      if (!user._id) throw new Error('Must be logged in');
      if (!_id) throw new Error('Must have email partial Id');

      // todo: remove partials from fs on removal
      await EmailPartial.findOneAndRemove({ _id })

      return {_id: ''}
    },
    ...
  },
```

`schema/EmailPartial.js`
```
import { gql } from "apollo-server";

const EmailPartial = gql`
 extend type Query {
   getCurrentEmailPartial(_id: String!): EmailPartial
   getAllEmailPartials(_id: String! offset: Int limit: Int): [EmailPartial]
   getEmailPartialsCount(_id: String!): Count
   downloadAllPartials: [EmailPartial]
 }
 type EmailPartial {
   _id: ObjectID
   title: String!
   createdAt: String
   createdById: String
   updatedAt: String
   updatedById: String
   folderPath: String
   mjmlSource: String
   organizationId: String
 }
 extend type Mutation {
   createEmailPartial(title: String!, mjmlSource: String, organizationId: String!, folderPath: String): EmailPartial
   editEmailPartial(_id: String!, title: String!, mjmlSource: String!, organizationId: String!, folderPath: String): EmailPartial
   deleteEmailPartial(_id: String!): EmailPartial
   duplicateEmailPartial(_id: String!): EmailPartial
 }
`

export default EmailPartial;
```

Import the pertinent files into their respective `index.js` and that will be automagically be loaded into `server.js` for you!

## Deploying
This app will be setup to deploy to your own instance of now.sh. Documentation for that is coming soon as the deploy script is finalized.

## Contributing

* Fork it ( https://github.com/teamsnap/jemal )
* Create your feature branch (git checkout -b my-new-feature)
* Commit your changes (git commit -am 'Add some feature')
* Push to the branch (git push origin my-new-feature)
* Create new Pull Request

## Todo:
See the issues marked: `Help Wanted`
