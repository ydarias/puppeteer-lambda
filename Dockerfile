FROM node:16-alpine as base
WORKDIR /usr/src/app

FROM base as builder
COPY package.json .
COPY tsconfig.json .
COPY src/ .
RUN yarn install
RUN yarn build

FROM base as dependencies
COPY package.json .
RUN yarn install --production

FROM public.ecr.aws/lambda/nodejs:16 as production
COPY --from=builder /usr/src/app/dist/ ./
COPY --from=dependencies /usr/src/app/node_modules/ ./node_modules
CMD [ "app.handler" ]
