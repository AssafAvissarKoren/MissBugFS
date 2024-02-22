import { utilService } from './../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'

const JSON_Path = './data/bug.json'
var bugs = utilService.readJsonFile(JSON_Path)
const PAGE_SIZE = 4
const ENTITY_COUNT = bugs.length


export const bugService = {
    query,
    getById,
    remove,
    save,
    PAGE_SIZE,
    ENTITY_COUNT,
}

async function query(filterBy = {}) {
    try {
        let bugsToReturn = [...bugs]
        if (filterBy.text) {
            const regExp = new RegExp(filterBy.text, 'i')
            bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
        }

        if (filterBy.minSeverity) {
            bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
        }
        if (filterBy.labels && filterBy.labels.length > 0) {
            bugsToReturn = bugsToReturn.filter(bug => bug.labels.some(label => filterBy.labels.includes(label)))
        }
        if (filterBy.pageIdx !== undefined) {
            const startIdx = (filterBy.pageIdx - 1) * PAGE_SIZE
            bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
        }
        if (filterBy.sortCriterion) {
            bugsToReturn.sort((a, b) => {
                if (filterBy.sortCriterion === 'date') return a.createdAt - b.createdAt
                if (filterBy.sortCriterion === 'title') return a.title.localeCompare(b.title)
            })
        }
        if (filterBy.createdBy) {
            bugsToReturn = bugsToReturn.filter(bug => bug.creator._id === filterBy.createdBy)
        }
        return bugsToReturn
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(bugId) {
    try {
        var bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw `Couldn't find bug with _id ${bugId}`
        return bug
    } catch (err) {
        loggerService.error(err)
        throw (err)
    }
}

async function remove(bugId) {
    try {
        const idx = bugs.findIndex(bug => bug._id === bugId)
        if (idx === -1) throw `Couldn't find bug with _id ${bugId}`
        bugs.splice(idx, 1)

        await utilService.saveJsonFile(bugs, JSON_Path)
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function save(bugToSave) {
    try {
        if (bugToSave._id) {
            var idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx === -1) throw `Couldn't find bug with _id ${bugId}`
            bugs.splice(idx, 1, bugToSave)
        } else {
            bugToSave._id = utilService.makeId()
            bugs.push(bugToSave)
        }
        await utilService.saveJsonFile(bugs, JSON_Path)
        return bugToSave
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}