import { Application } from 'express';
import swaggerUi from 'swagger-ui-express'

import swaggerSpecification from '@/docs/swagger.json';

export function setupSwagger(app: Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification))
}