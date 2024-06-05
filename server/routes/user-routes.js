import express from 'express';
import {
    fetchUsers,
    fetchGroups,
    fetchRelatedUsers
} from '../controllers/user-controller.js';
import { authorizationHandler } from '../utils/authorizationHandler.js'

const router = express.Router();

router.get('/fetchUsers', authorizationHandler, fetchUsers);

router.get('/fetchGroups', authorizationHandler, fetchGroups);

router.get('/fetchRelatedUsers', authorizationHandler, fetchRelatedUsers)

export default router;