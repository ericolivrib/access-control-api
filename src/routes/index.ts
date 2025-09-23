import { AccessController } from '@/controllers/accesses.controller';
import { authController } from '@/controllers/auth.controller';
import { ResourceController } from '@/controllers/resources.controller';
import captureError from '@/middlewares/captureError';
import validateRequestBody from '@/middlewares/validateRequestBody';
import verifyJwt from '@/middlewares/verifyJwt';
import { changeUserActivationSchema } from '@/schemas/change-user-activation.schema';
import { createUserSchema } from '@/schemas/create-user.schema';
import { loginSchema } from '@/schemas/login.schema';
import e from 'express';

const router = e.Router();

router.post('/v1/auth/register', validateRequestBody(createUserSchema), captureError(authController.registerUser));

router.post('/v1/auth/login', validateRequestBody(loginSchema), authController.login);

router.get('/v1/users', verifyJwt, authController.getUsers);

router.patch('/v1/users/:id', verifyJwt, validateRequestBody(changeUserActivationSchema), authController.changeUserActivation);

router.get('/v1/accesses', AccessController.getAllAccesses);

router.post('/v1/users/:id/accesses', AccessController.grantAccess);

router.get('/v1/users/:id/accesses', AccessController.getUserAccesses);

router.patch('/v1/accesses/:id', AccessController.changeAccessExpirationDate);

router.delete('/v1/accesses/:id', AccessController.revokeAccess);

router.get('/v1/resources', ResourceController.getResources);

export default router;