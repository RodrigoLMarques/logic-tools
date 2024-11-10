FROM node:18-buster

WORKDIR /home/node/app

COPY . .

RUN npm install --include=optional --quiet --no-optional --no-fund --loglevel=error

RUN chown -R node:node ./

RUN  npm run build

EXPOSE 3000

CMD ["sh", "-c", "run start:prod"]
