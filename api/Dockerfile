# default script from strapi official docs
FROM node:22-alpine
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev bash vips-dev git
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm ci
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .

RUN chmod 777 /opt
USER root 
EXPOSE 1337

CMD ["npm", "run", "develop"]
