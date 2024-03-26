const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:8000',
  components: {
    securitySchemes:{
        bearerAuth: {
            type: 'http',
            scheme: 'bearer'
        }
    }
  }
};

const outputFile = './swagger-output.json';
const routes = [ './app.js'];
swaggerAutogen(outputFile, routes, doc);
