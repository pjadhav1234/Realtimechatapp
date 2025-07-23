// Import the Express framework
import express from 'express';
import { login, logout, signup,updateProfile,checkAuth } from '../controllers/auth.controller.js';
import {protectRoute}  from '../middleware/auth.middleware.js';

// Create an isolated mini‑router for auth‑related endpoints
const router = express.Router();



router.post('/signup',signup);

router.post('/login',login);

router.post('/logout', logout);  

router.put('/update-profile', protectRoute,updateProfile);  //
// protectRoute := Middleware function to protect the route (e.g., verify JWT or session)
 // updateProfile:= Controller function that handles the logic of updating the user profile

router.get('/check', protectRoute,checkAuth);

export default router;