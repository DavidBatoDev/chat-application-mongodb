import express from 'express';
import {
    fetchChats,
    fetchGroups,
    accessChat,
    createGroup,
    leftGroup
} from '../controllers/chat-controller';
import { authorizationHandler } from '../utils/authorizationHandler';

const router = express.Router();

router.get('/', authorizationHandler, fetchChats);

router.get('/fetchGroups', authorizationHandler, fetchGroups);

router.get('/accessChat', authorizationHandler, accessChat);

router.post('/createGroup', authorizationHandler, createGroup);

router.post('/leftGroup', authorizationHandler, leftGroup);