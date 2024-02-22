import express from 'express'
import { getUser, getUsers, deleteUser, addUser } from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:userId', getUser)
router.delete('/:userId', deleteUser)
router.post('/', addUser)
router.put('/:userId', addUser)


export const userRoutes = router