import { utilService } from './../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

const COLL_NAME = 'user'
const collection = await dbService.getCollection(COLL_NAME);

export const userService = {
    query,
    getById,
    remove,
    add,
    update,
    getByUsername,
}

async function query() {
    try {
        return await collection.find({}).toArray();
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(userId) {
    console.log('user.service getById:', userId)
    try {
        const user = await collection.findOne({ _id: userId });
        if (!user) throw `Couldn't find user with _id ${userId}`;
        return user;
    } catch (err) {
        loggerService.error(err);
        throw err;
    }
}

async function getByUsername(username) {
    console.log('user.service getByUsername:', username)
    try {
        const user = await collection.findOne({ username: username });
        if (!user) throw `Couldn't find user with username ${username}`;
        return user;
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function remove(userId) {
    console.log('user.service remove:', userId)
    try {
        const result = await collection.deleteOne({ _id: userId });
        if (result.deletedCount === 0) throw `Couldn't remove user with _id ${userId}`;
        return result;
    } catch (err) {
        loggerService.error(err);
        throw err;
    }
}

async function add(user) {
    console.log('user.service add:', user)
    try {
        user._id = utilService.makeId()
        await collection.insertOne(user);
        return user
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}


async function update(user) {
    console.log('user.service update:', user)
    try {
        const result = await collection.updateOne({ _id: user._id }, { $set: user });
        if (result.modifiedCount === 0) throw `Couldn't find user with _id ${user._id}`;
        return user;
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}