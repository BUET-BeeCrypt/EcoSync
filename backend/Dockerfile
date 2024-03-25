# Dockerfile

FROM node:18.16.0-alpine3.17
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DB_URL="postgres://mfbduoao:m5M02hX1ObP_C3zALot-FX7TAlEY5D7s@rain.db.elephantsql.com/mfbduoao"
EXPOSE 8000
CMD [ "npm", "start"]