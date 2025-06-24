import { Router } from'express';
import { getDeviceDetails, verifyDevice} from '../controllers/deviceController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/verify-device', verifyDevice);
router.post('/details', getDeviceDetails); 

export default router;