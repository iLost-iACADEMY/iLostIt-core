FROM node:19.3.0
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .