import express from 'express'
import { getSettings, addBug, getBug, getBugs, removeBug, updateBug } from './bug.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireUser } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/settings', log, getSettings)
router.get('/', log, getBugs)
router.get('/:bugId', log, getBug)
router.delete('/:bugId', log, requireUser, removeBug)
router.post('/', log, requireUser, addBug)
router.put('/:bugId', log, requireUser, updateBug)

export const bugRoutes = router
