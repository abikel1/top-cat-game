import { Router } from 'express';
import { addUserController, updateScoreController,topController,aroundController,bottomController } from '../controllers/usersController.js';

const router = Router();

router.post('/', addUserController);
router.patch('/:id/score', updateScoreController);
router.get('/top', topController);
router.get('/around/:userId', aroundController);
router.get('/bottom', bottomController);
export default router;
