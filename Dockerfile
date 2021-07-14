FROM node:alpine AS build
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
RUN yarn build

FROM nginx AS production
COPY --from=build /usr/src/app/build /usr/share/nginx/html 