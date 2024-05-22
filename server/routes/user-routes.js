import express from 'express';
import {
    fetchAllUsers
} from '../controllers/user-controller.js';

const router = express.Router();

router.get('/fetchUsers', fetchAllUsers);

export default router;