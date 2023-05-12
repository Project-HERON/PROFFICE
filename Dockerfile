FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

COPY *.env ./

COPY prisma/ ./prisma/

RUN yarn install

COPY . .

RUN yarn prisma generate

RUN yarn build

EXPOSE 3000

CMD [ "/bin/bash", "-c", "yarn prisma db push --skip-generate --accept-data-loss;yarn start" ]