import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/bug/' :
    '//localhost:3030/api/bug/'

export const bugService = {
	query,
	get,
	remove,
	add,
    update,
	getEmptyBug,
	getDefaultFilter,
	filterURL,
    getSettings,
}

async function query(filterBy = {}) {
    var { data: bugs } = await axios.get(BASE_URL, { params: filterBy })
    return bugs
}

async function get(bugId) {
    const url = BASE_URL + bugId   
    var { data: bug } = await axios.get(url)
    return bug
}

async function remove(bugId) {
    const url = BASE_URL + bugId
    var { data: res } = await axios.delete(url)
    return res
}

async function add(bug) {
    const url = BASE_URL
    const { data: savedBug } = await axios.post(url, bug)
    return savedBug
}

async function update(bug) {
    const url = BASE_URL + bug._id
    const { data: savedBug } = await axios.put(url, bug)
    return savedBug
}

function getEmptyBug(title = '', severity = '', description = '') {
	return { title, severity, description, createdAt: null }
}

function getDefaultFilter(params) {
	return { 
		text: params.text || "", 
		minSeverity: params.minSeverity || "",
        labels: params.labels || [],
        pageIdx: params.page || 1,
        sortCriterion: params.sortCriterion || "",
        createdBy: params.createdBy || "",
	}
}

function filterURL(filterBy) {
    let url = `/bug/`
    const queryParams = new URLSearchParams()

    if (filterBy.text) {
        queryParams.append('text', filterBy.text)
    }
    if (filterBy.minSeverity) {
        queryParams.append('minSeverity', filterBy.minSeverity)
    }
    if (filterBy.labels && filterBy.labels.length > 0) {
        queryParams.append('labels', filterBy.labels)
    }
    if (filterBy.pageIdx) {
        queryParams.append('page', filterBy.pageIdx)
    }
    if (filterBy.sortCriterion) {
        queryParams.append('sortCriterion', filterBy.sortCriterion)
    }
    if ([...queryParams].length) {
        url += `?${queryParams}`
    }
    return url
}

async function getSettings() {
    const url = BASE_URL + 'settings'
    try {
        var { data: settings } = await axios.get(url)
        return settings
    } catch (error) {
        console.error('Error fetching settings:', error)
        return { bugsPerPage: 4, totalNumberOfBugs: 14 }
    }
}
