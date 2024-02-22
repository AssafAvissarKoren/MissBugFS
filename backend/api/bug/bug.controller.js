// bug CRUDL API
import { bugService } from './bug.service.js'
import { authService } from '../auth/auth.service.js'


// List
export async function getBugs(req, res) {
    try {
        const filterBy = {
            text: req.query.text || '',
            minSeverity: +req.query.minSeverity || 0,
            labels: req.query.labels || [],
            pageIdx: req.query.pageIdx || undefined,
            sortCriterion: req.query.sortCriterion || '',
            createdBy: req.query.createdBy || undefined,
        }
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        res.status(400).send(`Couldn't get bugs`)
    }
}


// Read
export async function getBug(req, res) {
    const { bugId } = req.params
    try {
        // Retrieve visited bug IDs from the cookie or initialize an empty array
        const visitedBugs = JSON.parse(req.cookies.visitedBugs || '[]')

        // If the current bug's ID is not in the visited bugs array, add it
        if (!visitedBugs.includes(bugId)) {
            visitedBugs.push(bugId)
        }

        // If the number of unique visited bug IDs exceeds 3, respond with an error
        if (visitedBugs.length > 3) {
            return res.status(401).send('Wait for a bit')
        }

        // Update the visited bugs array in the cookie and set its expiration time to 7 seconds
        res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 20 * 1000 })

        // Print a message to the backend console with the visited bug IDs
        console.log('User visited the following bugs:', visitedBugs)

        // Retrieve the bug data by ID and send it as the response
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (err) {
        res.status(400).send(`Couldn't get bug`)
    }
}


// Delete
export async function removeBug(req, res) {
    const { bugId } = req.params

    try {
        const loggedinUser = authService.validateToken(req.cookies.loginToken)
        const bug = await bugService.getById(bugId)
        if (loggedinUser._id !== bug.creator._id || loggedinUser.isAdmin !== true) {
            return res.status(401).send('Not authorized')
        }
        await bugService.remove(bugId)
        res.send('Deleted OK')
    } catch (err) {
        res.status(400).send(`Couldn't remove bug`)
    }
}


// Create
export async function addBug(req, res) {
    const bugToSave = req.body
    try {
        const loggedinUser = authService.validateToken(req.cookies.loginToken)
        const bugWithCreator = { ...bugToSave, creator: { _id: loggedinUser._id, username: loggedinUser.username } }
        const savedbug = await bugService.save(bugWithCreator)
        res.send(savedbug)
    } catch (err) {
        res.status(400).send(`Couldn't save bug`)
    }
}

export async function updateBug(req, res) {
    const { bugId } = req.params
    const bugToUpdate = req.body
    try {
        const loggedinUser = authService.validateToken(req.cookies.loginToken)
        const bug = await bugService.getById(bugId)
        if (loggedinUser._id !== bug.creator._id || loggedinUser.isAdmin !== true) {
            return res.status(401).send('Not authorized')
        }
        const savedbug = await bugService.save(bugToUpdate)
        res.send(savedbug)
    } catch (err) {
        res.status(400).send(`Couldn't update bug`)
    }
}

// Get Settings
export async function getSettings(req, res) {
    const settings = {
      bugsPerPage: bugService.PAGE_SIZE,
      totalNumberOfBugs: bugService.ENTITY_COUNT
    }
    res.json(settings)
}
