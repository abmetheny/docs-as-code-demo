FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies first so Docker can cache this layer.
COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

ENV PORT=8080
EXPOSE 8080

# Run as the non-root user that ships with the node image.
USER node

CMD ["node", "src/server.js"]
