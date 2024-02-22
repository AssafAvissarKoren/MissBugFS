import { userService } from './user.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.userId)
        res.send(user)
    } catch (err) {
        loggerService.error('Failed to get user', err)
        res.status(400).send({ err: 'Failed to get user' })
    }
}

export async function getUsers(req, res) {
    try {
        const filterBy = {
            username: req.query.username || '',
            fullname: req.query.fullname || '',
            minScore: +req.query.minScore || 0
        }
        const users = userService.query(filterBy)
        res.send(users)
    } catch (err) {
        loggerService.error('Failed to get users', err)
        res.status(400).send({ err: 'Failed to get users' })
    }
}

export async function deleteUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        loggerService.error('Failed to delete user', err)
        res.status(400).send({ err: 'Failed to delete user' })
    }
}

export async function addUser(req, res) {
    console.log('req.body:', req.body)
    try {
        const user = req.body
        const savedUser = await userService.save(user)
        res.send(savedUser)
    } catch (err) {
        loggerService.error('Failed to create user', err)
        res.status(400).send({ err: 'Failed to create user' })
    }
}

