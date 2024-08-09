// api.routes.ts

// Dependencias
import { Router } from 'express';

// Middleware
import { authToken } from '../middlewares/bearerToken';
import { validateSchema } from '../middlewares/validateSchema';

// Controladores
import { loginUser, registerUser, validarToken } from '../controller/auth.controller';
import { deleteUser, getManyUsers, getOneUser, updateUser } from '../controller/user.controller';
import { getInterest, getTypeInterest, getUserInterest, registerInterest } from '../controller/interests.controller';
import { createLike, getLikes, checkLikeExists } from '../controller/like.controller'; 
import { createConversation, getConversations, sendMessage, getMessages } from '../controller/conversation.controller';

// Schemas
import { UserLoginSchema, UserRegisterSchema } from '../schemas/UserSchema';

// Instancia del Modulo Router
const router = Router();

// Auth routes
router.post('/register', validateSchema(UserRegisterSchema), registerUser);
router.post('/login', validateSchema(UserLoginSchema), loginUser);
router.post('/auth', authToken, validarToken);

router.route('/user')
  .all(authToken)
  .get(getOneUser)
  .patch(updateUser)
  .delete(deleteUser);

router.route('/users')
  .all(authToken)
  .get(getManyUsers);

router.route('/user-interest')
  .all(authToken)
  .get(getUserInterest);

router.route('/interest-type')
  .all(authToken)
  .get(getTypeInterest);

router.route('/interest')
  .all(authToken)
  .get(getInterest);

router.route('/register-interest')
  .all(authToken)
  .post(registerInterest);

router.route('/like')
  .all(authToken)
  .post(createLike);

router.route('/likes')
  .all(authToken)
  .get(getLikes);

router.route('/likes/check')  
  .all(authToken)
  .get(checkLikeExists);  

router.route('/conversation')
  .all(authToken)
  .post(createConversation)
  .get(getConversations); // Esta ruta ya debería proporcionar las conversaciones con el último mensaje

router.route('/conversation/:conversationId/messages')
  .all(authToken)
  .get(getMessages);

router.route('/message')
  .all(authToken)
  .post(sendMessage);

// Exportación del Modulo
export default router;
