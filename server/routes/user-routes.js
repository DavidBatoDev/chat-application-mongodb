import express from 'express';
import {
    fetchAllUsers
} from '../controllers/user-controller.js';
import { authorizationHandler } from '../utils/authorizationHandler.js'

const router = express.Router();

router.get('/fetchUsers', authorizationHandler, fetchAllUsers);

export default router;