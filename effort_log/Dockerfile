# Etapa 1: build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Etapa 2: imagem final
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./
RUN yarn install --production

EXPOSE 3000

CMD ["yarn", "start"]
