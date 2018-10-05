FROM node:10.11.0 as build-deps

ENV NODE_ENV development

ENV REACT_APP_GRAPHQL_URI http://localhost:4000/graphql

ENV SERVER_PORT 4000
ENV MONGO_URI xx
ENV JWT_SECRET super-secret
ENV NODEMAILER_SERVICE xx
ENV NODEMAILER_USER xx
ENV NODEMAILER_PASS xx
ENV APP_URL http://localhost:4000

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build
CMD npm start
EXPOSE 4000
