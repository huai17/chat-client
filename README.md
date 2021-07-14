# Chat-Client

A simple chat client built with socket.io-client.

## Development Environment

The development server will restart automatically while you modify the source code.

- NodeJS

  You need to install NodeJS in your local machine.

  First, install dependancies with `yarn install` or `npm install`.

  Then, start the dev server with `yarn dev` or `npm run dev`.

- Docker

  You need to install Docker in your local machine.

  Build and start the dev server with `docker-compose -f docker-compose.dev.yaml up`.

## Test Environment

- NodeJS

  The test environment is the same as development environment.

  Instead of starting the server, run the test with `yarn test` or `npm run test`.

- Docker

  First, build and start the dev server.

  Then, test with `docker exec -it chat-client_dev_1 yarn test`.

  The **chat-client_dev_1** part is the container tag, the naming may be varius in different machine.

## Production Environment

- NodeJS

  You need to install NodeJS in your local machine.

  First, install dependancies with `yarn install` or `npm install`.

  Second, build the server with `yarn build` or `npm run build`.

  Then, put the files in **build/** to a static web server, such as nginx.

- Docker

  You need to install Docker in your local machine.

  Build and start the prod server with `docker-compose up`.

## Port Config

The dev server listen on port 3000 and the prod server listen on port 80 by default.

For Docker, the port setting is in files: **dicker-compose.yaml** and **dicker-compose.dev.yaml**.

## Chat Server Config

The url of chat-server is **<http://localhost:5566>** by default.

You can change the default url in file: **src/index.ts**.
