import express from 'express';
import {
    fetchChats,
    fetchChat,
    fetchGroups,
    createGroup,
    leftGroup
} from "../controllers/chat-controller.js"
import { authorizationHandler } from '../utils/authorizationHandler.js';

const router = express.Router();

router.get('/', authorizationHandler, fetchChats);  // fetch all the chats of a user

router.get('/fetchGroups', authorizationHandler, fetchGroups); // fetch all the groups of a user

router.get('/accessChat/:userId', authorizationHandler, fetchChat); // fetch chat with a user (between current user and the user with userId)

router.post('/createGroup', authorizationHandler, createGroup); // create a group

router.post('/leftGroup', authorizationHandler, leftGroup); // left a group

export default router;