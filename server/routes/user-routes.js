import express from 'express';
import {
    fetchUser,
    fetchUsers,
    fetchGroups,
    fetchRelatedUsers,
    updateUser,
    fetchOtherUser
} from '../controllers/user-controller.js';
import { authorizationHandler } from '../utils/authorizationHandler.js'

const router = express.Router();

router.get('/fetchUser', authorizationHandler, fetchUser);

router.get('/fetch-other-user/:userId', authorizationHandler, fetchOtherUser);

router.get('/fetchUsers', authorizationHandler, fetchUsers);

router.get('/fetchGroups', authorizationHandler, fetchGroups);

router.get('/fetchRelatedUsers', authorizationHandler, fetchRelatedUsers)

router.put('/updateUser/:userId', authorizationHandler, updateUser);

export default router;