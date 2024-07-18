import express from 'express';
import {
    fetchUser,
    fetchUsers,
    fetchGroups,
    fetchRelatedUsers,
    updateUser
} from '../controllers/user-controller.js';
import { authorizationHandler } from '../utils/authorizationHandler.js'

const router = express.Router();

router.get('/fetchUser', authorizationHandler, fetchUser);

router.get('/fetchUsers', authorizationHandler, fetchUsers);

router.get('/fetchGroups', authorizationHandler, fetchGroups);

router.get('/fetchRelatedUsers', authorizationHandler, fetchRelatedUsers)

router.put('/updateUser/:userId', authorizationHandler, updateUser);

export default router;