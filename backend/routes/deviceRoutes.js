import { Router } from'express';
import { getDeviceDetails, verifyDevice} from '../controllers/deviceController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/verify-device', verifyDevice);
router.get('/:macId', getDeviceDetails); 

export default router;