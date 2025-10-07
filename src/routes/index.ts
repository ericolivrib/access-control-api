import { accessController } from '@/controllers/access.controller';
import { authController } from '@/controllers/auth.controller';
import { permissionController } from '@/controllers/permission.controller';
import validateRequestBody from '@/middlewares/validateRequestBody';
import verifyJwt from '@/middlewares/verifyJwt';
import verifyPermission from '@/middlewares/verifyPermissions';
import { changeUserActivationSchema } from '@/schemas/change-user-activation.schema';
import { createUserSchema } from '@/schemas/create-user.schema';
import { grantAccessSchema } from '@/schemas/grant-access.schema';
import { loginSchema } from '@/schemas/login.schema';
import e from 'express';

const router = e.Router();

router.post(
  '/v1/auth/register',
  validateRequestBody(createUserSchema),
  authController.registerUser
);

router.post(
  '/v1/auth/login',
  validateRequestBody(loginSchema),
  authController.login
);

router.get(
  '/v1/users',
  verifyJwt,
  verifyPermission('get_users'),
  authController.getUsers);

router.post(
  '/v1/users',
  verifyJwt,
  verifyPermission('create_user'),
  validateRequestBody(createUserSchema),
  authController.registerUser);

router.patch(
  '/v1/users/:id',
  verifyJwt,
  verifyPermission('change_user_activation'),
  validateRequestBody(changeUserActivationSchema),
  authController.changeUserActivation
);

router.get(
  '/v1/accesses',
  accessController.getAllAccesses
);

router.post(
  '/v1/users/:userId/accesses',
  verifyJwt,
  verifyPermission('grant_access'),
  validateRequestBody(grantAccessSchema),
  accessController.grantAccess
);

router.get(
  '/v1/users/:userId/accesses',
  verifyJwt,
  verifyPermission('get_user_accesses'), // TODO: Criar permissão get_user_accesses
  accessController.getUserAccesses
);

router.patch(
  '/v1/accesses/:id',
  accessController.changeAccessExpirationDate
);

router.delete(
  '/v1/accesses/:id',
  verifyJwt,
  verifyPermission('revoke_access'),
  accessController.revokeAccess
);

router.get(
  '/v1/permissions',
  verifyJwt,
  permissionController.getPermissions
);

export default router;