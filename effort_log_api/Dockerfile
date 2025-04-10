FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache yarn

COPY package.json yarn.lock ./
RUN yarn install

COPY prisma ./prisma
RUN yarn prisma generate

COPY . .
RUN yarn build

FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache yarn

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3366

CMD sh -c "yarn prisma migrate deploy && node dist/main"
