import { Router } from 'express'
// import sadminMiddlewareMiddleware from '../middleware/authMiddleware.js'
import { checkActivation } from '../controllers/SAdminController.js'

const router = Router()

router.post('/check-activation', checkActivation);

export default router