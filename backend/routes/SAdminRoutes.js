import { Router } from 'express'
// import sadminMiddlewareMiddleware from '../middleware/authMiddleware.js'
import { activate, checkActivation } from '../controllers/SAdminController.js'

const router = Router()

router.post('/check-activation', checkActivation);
router.post('/activate', activate);

export default router