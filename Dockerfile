FROM node:jod-bullseye

ENV HOST=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_TELEMETRY_DEBUG=1

RUN npm install -g typescript

WORKDIR /app

COPY . .

WORKDIR /app/vite-frontend

RUN npm i
RUN npm run build

WORKDIR /app/keystonejs-backend

RUN npm i
RUN npm run build

ENV NODE_ENV=production

RUN npm prune

CMD ["npx", "keystone", "start"]
