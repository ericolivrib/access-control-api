import { AccessController } from '@/controllers/accesses.controller';
import { AuthController } from '@/controllers/auth.controller';
import { ResourceController } from '@/controllers/resources.controller';
import validateRequestBody from '@/middlewares/validateRequestBody';
import { createUserSchema } from '@/schemas/create-user.schema';
import e from 'express';

const router = e.Router();

router.post('/v1/auth/register', validateRequestBody(createUserSchema), AuthController.registerUser);

router.post('/v1/auth/login', AuthController.login);

router.get('/v1/users', AuthController.getUsers);

router.patch('/v1/users/:id', AuthController.changeUserActivation);

router.get('/v1/accesses', AccessController.getAllAccesses);

router.post('/v1/users/:id/accesses', AccessController.grantAccess);

router.get('/v1/users/:id/accesses', AccessController.getUserAccesses);

router.patch('/v1/accesses/:id', AccessController.changeAccessExpirationDate);

router.delete('/v1/accesses/:id', AccessController.revokeAccess);

router.get('/v1/resources', ResourceController.getResources);

export default router;