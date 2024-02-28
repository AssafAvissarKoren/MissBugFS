import express from 'express'
import { getMsg, getMsgs, deleteMsg, addMsg, updateMsg } from './msg.controller.js'

const router = express.Router()

router.get('/', getMsgs)
router.get('/:msgId', getMsg)
router.delete('/:msgId', deleteMsg)
router.post('/', addMsg)
// router.put('/:msgId', updateMsg)


export const msgRoutes = router