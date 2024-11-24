FROM node:18-buster

WORKDIR /usr/src/api

COPY . .

RUN npm install --quiet --no-optional --no-fund --loglevel=error

RUN npm install rollup@latest --save-dev

RUN chown -R node:node ./

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]
