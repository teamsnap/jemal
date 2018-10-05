# Do the npm install or yarn install in the full image
FROM mhart/alpine-node:10

ENV NODE_ENV production
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
RUN apk add --no-cache make gcc g++ python
RUN npm ci --prod
RUN npm run build

# And then copy over node_modules, etc from that stage to the smaller base image
FROM mhart/alpine-node:base-8
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app .
COPY . .
EXPOSE 4000
CMD ["node", "./server/server.js"]
