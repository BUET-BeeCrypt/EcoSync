# Dockerfile

# Stage 1 - the build process
FROM node:18.16.0-alpine3.17 as build
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV REACT_APP_BASE_URL=http://localhost:8000
RUN npm run build

# Stage 2 - the production environment
FROM nginx:stable-alpine as final
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

ENV REACT_APP_BASE_URL=http://localhost:8000
EXPOSE 80

CMD find /usr/share/nginx/html -type f -exec sed -i "s/http:\/\/localhost:8000/$(echo $REACT_APP_BASE_URL | sed 's/\//\\\//g')/g" {} + && nginx -g 'daemon off;'