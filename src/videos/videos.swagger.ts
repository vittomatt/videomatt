import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Videos API',
            version: '1.0.0',
            description: 'Videos API',
        },
    },
    apis: [
        './src/videos/videos/infrastructure/controllers/**/*.controller.ts',
        './src/videos/video-comment/infrastructure/controllers/**/*.controller.ts',
    ],
});
