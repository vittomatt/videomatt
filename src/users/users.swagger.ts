import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Users API',
            version: '1.0.0',
            description: 'Users API',
        },
    },
    apis: ['./src/users/infrastructure/controllers/**/*.controller.ts'],
});
