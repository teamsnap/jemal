FROM node:10.11.0 as build-deps

ENV NODE_ENV development
ENV REACT_APP_GRAPHQL_URI $NOW_URL/graphql
ENV SERVER_PORT 4000
ENV APP_URL $NOW_URL

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build
CMD npm start
EXPOSE 4000
