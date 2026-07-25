FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache \
    bash \
    sqlite \
    sqlite-dev \
    npm

RUN npm init -y

RUN npm install \
  express \
  sqlite3 \
  cors \
  dotenv

RUN npm install -D \
  nodemon

WORKDIR /app

RUN echo "alias ll='ls -alh'" >> /root/.bashrc

CMD ["bash"]