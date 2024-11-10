FROM node:18-buster

WORKDIR /home/node/app

COPY . .

RUN npm install --quiet --no-fund --loglevel=error

RUN npm install rollup@latest --save-dev

RUN chown -R node:node ./

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]
