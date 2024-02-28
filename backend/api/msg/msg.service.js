import { utilService } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

const COLL_NAME = 'msg'
const collection = await dbService.getCollection(COLL_NAME);

export const msgService = {
    query,
    getById,
    remove,
    add,
    update,
}

async function query() {
    try {
        const messages = await _aggregateMsgs({})
        if (!messages) throw `No msgs found in the collection ${COLL_NAME}`;
        return messages;
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(msgId) {
    try {
        const messages = await _aggregateMsgs({ _id: msgId })
        if (!messages) throw `Couldn't find msg with _id ${msgId}`;
        return messages[0];
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function remove(msgId) {
    try {
        const result = await collection.deleteOne({ _id: msgId });
        if (result.deletedCount === 0) throw `Couldn't remove msg with _id ${msgId}`;
        return result;
    } catch (err) {
        loggerService.error(err);
        throw err;
    }
}

async function add(msg) {
    try {
        msg._id = utilService.makeId()
        await collection.insertOne(msg);
        return await getById(msg._id);
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function update(msg) {
    try {
        const result = await collection.updateOne({ _id: msg._id }, { $set: msg });
        if (result.modifiedCount === 0) throw `Couldn't find msg with _id ${msg._id}`;
        return await getById(msg._id);
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function _aggregateMsgs(match) {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        const message = await collection.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'bug',
                    localField: 'aboutBugId',
                    foreignField: '_id',
                    as: 'aboutBug'
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'byUserId',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$aboutBug'
            },
            {
                $unwind: '$byUser'
            },
            {
                $project: {
                    _id: true,
                    txt: true,
                    aboutBug: {
                        _id: '$aboutBug._id',
                        title: '$aboutBug.title',
                        severity: '$aboutBug.severity'
                    },
                    byUser: {
                        _id: '$byUser._id',
                        fullname: '$byUser.fullname'
                    }
                }
            }
        ]).toArray();

        if (!message || message.length === 0) {
            throw new Error(`Message with ID ${msgId} not found`);
        }

        return message;
    } catch (err) {
        console.error(`Error fetching message with ID ${msgId}:`, err);
        throw err;
    }
}

