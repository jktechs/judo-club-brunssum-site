FROM archlinux:base-devel

RUN pacman -Sy nodejs-lts-jod npm --noconfirm

WORKDIR /app

COPY ./app/package.json .

RUN npm install
# --production

RUN npx next telemetry disable

EXPOSE 3000

CMD ["npm", "run", "dev"]
