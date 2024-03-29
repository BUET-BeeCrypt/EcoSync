# Dockerfile

FROM node:18.16.0-alpine3.17
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DB_URL="postgres://mfbduoao:m5M02hX1ObP_C3zALot-FX7TAlEY5D7s@rain.db.elephantsql.com/mfbduoao"
ENV PORT=8000
ENV JWT_SECRET_KEY="secret"
ENV REFRESH_TOKEN_SECRET_KEY="refresh"
ENV EMAIL_ID=syncinc408@gmail.com
ENV EMAIL_PASS=dczlxzhbozamacbu
ENV EMAIL_HOST=smtp.gmail.com
EXPOSE 8000
CMD [ "npm", "start"]