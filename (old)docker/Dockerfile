FROM node:10.6.0

WORKDIR /usr/src/app

COPY . .
# could have just copied the current node_modules folder,
# but the platform on which Docker runs might be different than the one the initial repositories were pulled in
RUN yarn

EXPOSE 8080

CMD yarn start-prod
