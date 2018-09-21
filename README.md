# JEMAL
###### Jolly Email Management Application
The purpose of this application is to decouple the need to create emails inside of an ESP (Email Sending/Service Provider). This was born of out becoming tired of having to manage the creation of emails that was sent across three plus ESPs. It is a graphql and react application that provides previews and CRUD operations leveraging the MJML email framework.

[GIF]

##### Technologies:
* MJMl (Email template language)
* React bootstrapped through Create React App
* Apollo
    * Client
    * Server
* MongoDB
* Mongoose to work with MongoDB

See their docs for more information

## Getting started

With git:
```bash
git clone https://github.com/xxx
cd jemal
npm install
npm start
```

With Docker:
Coming soon to a branch near you!

## Client application

#### File structure
Client app is housed in the `src` folder
The CRA index.html is in the public folder
General components go into the `src/Components` folder
Create your routes in the `src/routes` folder
Pull them into the file `App.js`. If you need auth, using the `<PrivateRoute />` component, that will handle the hardwork for you.
Follow the Apollo best practices, it handles all the caching, data request, etc for us :)
Using material-ui to handle the pretty parts

## Server application

#### File structure
xxx

## Setting up your Application

#### File structure
xxx

## Todo:
See the issues marked: `Help Wanted`
