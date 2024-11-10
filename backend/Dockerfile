FROM node:18-buster

WORKDIR /home/node/app

COPY . .

RUN apt update && \
    apt install -y gcc

RUN gcc ./../algorithms/logicalExpressionEvaluator.c -o ./src/bin/logicalExpressionEvaluator

RUN npm install --include=optional --quiet --no-optional --no-fund --loglevel=error

RUN chown -R node:node ./

RUN  npm run build

EXPOSE 3001

CMD ["sh", "-c", "run start:prod"]
