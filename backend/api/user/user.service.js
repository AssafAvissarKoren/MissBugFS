import { utilService } from '../../services/util.service.js'
import { loggerService } from  '../../services/logger.service.js'

export const userService = {
    query,
    getById,
    remove,
    save,
    getByUsername,
}

const JSON_Path = './data/user.json'
var users = utilService.readJsonFile(JSON_Path)
const PAGE_SIZE = 4

function query() {
    try {
        return users
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(userId) {
    console.log('user.service getById:', userId)
    try {
        var user = users.find(user => user._id === userId)
        if (!user) throw `Couldn't find user with _id ${userId}`
        return user
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getByUsername(username) {
    console.log('user.service getByUsername:', username)
    try {
        return users.find(user => user.username === username)
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function remove(userId) {
    console.log('user.service remove:', userId)
    try {
        const idx = users.findIndex(user => user._id === userId)
        if (idx === -1) throw `Couldn't find user with _id ${userId}`
        users.splice(idx, 1)
        await utilService.saveJsonFile(users, JSON_Path)
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function save(userToSave) {
    console.log('user.service save:', userToSave)
    try {
        if (userToSave._id) {
            var idx = users.findIndex(user => user._id === userToSave._id)
            if (idx === -1) throw `Couldn't find user with _id ${userId}`
            users.splice(idx, 1, userToSave)
        } else {
            userToSave._id = utilService.makeId()
            users.push(userToSave)
        }
        await utilService.saveJsonFile(users, JSON_Path)
        return userToSave
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}