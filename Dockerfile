FROM node:10.11.0 as build-deps

ENV NODE_ENV development

ENV REACT_APP_GRAPHQL_URI http://localhost:4100/graphql

ENV SERVER_PORT 4000
ENV MONGO_URI xx
ENV JWT_SECRET super-secret
ENV NODEMAILER_SERVICE xx
ENV NODEMAILER_USER xx
ENV NODEMAILER_PASS xx
ENV APP_URL http://localhost:4100

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
CMD npm start
EXPOSE 4000 4100
