import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';


const router =express.Router();

router.get('/users',protectRoute,getUsersForSidebar);
router.get('/:id',protectRoute,getMessage);
router.get('/send/:id',protectRoute,sendMessage);


export default router;