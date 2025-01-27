FROM node:20.11.0

RUN apt-get update && apt-get install -y awscli

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p dist
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]