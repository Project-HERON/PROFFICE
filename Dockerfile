FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

COPY *.env ./

COPY prisma/ ./prisma/

RUN yarn install

COPY . .

RUN yarn prisma db push --skip-generate --accept-data-loss

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]