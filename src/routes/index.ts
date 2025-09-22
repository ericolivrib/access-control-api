import { changeAccessExpirationDate, getAllAccesses, getUserAccesses, grantAccess, revokeAccess } from '@/controllers/accesses.controller';
import { changeUserActivation, getUsers, login, registerUser } from '@/controllers/auth.controller';
import { getResources } from '@/controllers/resources.controller';
import e from 'express';

const router = e.Router();

router.post('/v1/auth/register', registerUser);

router.post('/v1/auth/login', login);

router.get('/v1/users', getUsers);

router.patch('/v1/users/:id', changeUserActivation); // ativa ou desativa o usuário

router.get('/v1/accesses', getAllAccesses);

router.post('/v1/users/:id/accesses', grantAccess);

router.get('/v1/users/:id/accesses', getUserAccesses);

router.patch('/v1/accesses/:id', changeAccessExpirationDate); // altera a data de expiração

router.delete('/v1/accesses/:id', revokeAccess); // revoga o acesso

router.get('/v1/resources', getResources);

export default router;