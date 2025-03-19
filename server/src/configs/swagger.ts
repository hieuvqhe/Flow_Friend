import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flow Friend API',
      version: '1.0.0',
      description: 'API documentation for Flow Friend application',
      contact: {
        name: 'API Support',
        email: 'support@flowfriend.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.ts'], // paths to files containing OpenAPI annotations
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
