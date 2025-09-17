FROM node:22.18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Mount source code at runtime, so don't copy here

EXPOSE 3000

CMD ["npm", "start"]