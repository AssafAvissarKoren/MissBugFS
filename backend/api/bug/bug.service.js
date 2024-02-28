import { utilService } from './../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

const COLL_NAME = 'bug'
const PAGE_SIZE = 4
const collection = await dbService.getCollection(COLL_NAME);
const ENTITY_COUNT = await collection.countDocuments();

export const bugService = {
    query,
    getById,
    remove,
    update,
    add,
    PAGE_SIZE,
    ENTITY_COUNT,
}


async function query(filterBy = {}) {
    try {
        let criteria = {};
        if (filterBy.text) {
            const regExp = new RegExp(filterBy.text, 'i')
            criteria.title = { $regex: regExp };
        } 
        if (filterBy.minSeverity) {
            criteria.severity = { $gte: filterBy.minSeverity };
        }
        if (filterBy.labels && filterBy.labels.length > 0) {
            criteria.labels = { $in: filterBy.labels };
        }
        if (filterBy.createdBy) {
            criteria['creator._id'] = filterBy.createdBy;
        }

        let sortCriteria = {};
        if (filterBy.sortCriterion === 'date') {
            sortCriteria = { createdAt: 1 };
        } else if (filterBy.sortCriterion === 'title') {
            sortCriteria = { title: 1 };
        }

        let query = collection.find(criteria).sort(sortCriteria);

        if (filterBy.pageIdx !== undefined) {
            const startIdx = (parseInt(filterBy.pageIdx) - 1) * PAGE_SIZE;
            query = query.skip(startIdx).limit(PAGE_SIZE);
        }
        const bugs = await query.toArray();

        return bugs
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = await collection.findOne({ _id: bugId })
        return bug
    } catch (err) {
        console.log(`ERROR: cannot find bug ${bugId}`)
        throw err
    }
}

async function remove(bugId) {
    try {
        return await collection.deleteOne({ _id: bugId })
    } catch (err) {
        console.log(`ERROR: cannot remove bug ${bugId}`)
        throw err
    }
}

async function update(bug) {
    console.log('bug.service.js update', bug);
    try {
        const {updatedCount} = await collection.updateOne({ _id: bug._id }, { $set: bug })
        // if(updatedCount > 1)
        return bug
    } catch (err) {
        console.log(`ERROR: cannot update bug ${bug._id}`)
        throw err
    }
}

async function add(bug) {
    try {
        await collection.insertOne(bug)
        return bug
    } catch (err) {
        console.log(`ERROR: cannot insert bug`)
        throw err
    }
}