# Etapa 1: build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package.json yarn.lock ./
RUN yarn install

# Copiar código E o .env.production
COPY . .

#  Garante que o .env (ou .env.production) exista antes do build
COPY .env.production .env

# Faz o build com as variáveis de ambiente embutidas
RUN yarn build

# Etapa 2: imagem final
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./
RUN yarn install --production

EXPOSE 3000

CMD ["yarn", "start"]