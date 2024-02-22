import Axios from 'axios'
import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from './event-bus.service.js'

var axios = Axios.create({
    withCredentials: true,
})

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/user/' :
    '//localhost:3030/api/user/'

export const userService = {
    getLoggedinUser,
    saveLocalUser,
    getUsers,
	query,
	get,
	remove,
	save,
	getEmptyUser,
	getDefaultFilter,
	filterURL,
    getUserBugs,
}

async function query(filterBy = {}) {
    var { data: users } = await axios.get(BASE_URL, { params: filterBy })
    return users
}

async function getUsers() {
    const { data: users } = await axios.get(BASE_URL)
    return users
}

async function get(userId) {
    const url = BASE_URL + userId
    console.log('url:', url)
    
    var { data: user } = await axios.get(url)
    return user
}

async function remove(userId) {
    const userBugs = await getUserBugs(userId)
    if (userBugs.length) {
        return showErrorMsg('Cannot delete user with bugs')
    }
    const url = BASE_URL + userId
    var { data: res } = await axios.get(url)
    return res
}

async function save(user) {
    const method = user._id ? 'put' : 'post'
    const url = user._id ? BASE_URL + user._id : BASE_URL
    const { data: savedUser } = await axios[method](url, user)
    if (getLoggedinUser().id === savedUser.id) saveLocalUser(savedUser)
    return savedUser
}

function getEmptyUser(username = '', fullname = '', password = '', score = '', imgUrl = '') {
	return { username, fullname, password, score, imgUrl }
}

function getDefaultFilter(params) {
	return { 
		text: params.text || "", 
		minScore: params.minScore || "",
	}
}

function filterURL(filterBy) {
    let url = `/user/`
    const queryParams = new URLSearchParams()

    if (filterBy.text) {
        queryParams.append('text', filterBy.text)
    }
    if (filterBy.minScore) {
        queryParams.append('minScore', filterBy.minScore)
    }
    if ([...queryParams].length) {
        url += `?${queryParams}`
    }
    return url
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLocalUser(user) {
    try {
        user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
        sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
        console.log('saveLocalUser', user)
        return user
    } catch (err) {
        console.log('Cannot saveLocalUser', err)
        loggerService.error(err)
        throw (err)
    }
}

async function getUserBugs(userId) {
    try {
        const userFilter = { createdBy: userId }
        return await bugService.query(userFilter)
    } catch (err) {
        showErrorMsg('Cannot load user bugs')
    }
}


// [
//     "creator": { "_id": "u101", "fullname": "Puki Ja" },
//     "creator": { "_id": "u102", "fullname": "Muki Ba" },
//     "creator": { "_id": "u103", "fullname": "Muki Ja" },
//     "creator": { "_id": "u104", "fullname": "Harry Potter" },
//     "creator": { "_id": "u105", "fullname": "Hermione Granger" },
//     "creator": { "_id": "u106", "fullname": "Ron Weasley" },
//     "creator": { "_id": "u107", "fullname": "Albus Dumbledore" },
//     "creator": { "_id": "u108", "fullname": "Severus Snape" },
//     "creator": { "_id": "u109", "fullname": "Luna Lovegood" },
//     "creator": { "_id": "u110", "fullname": "Draco Malfoy" },
//     "creator": { "_id": "u111", "fullname": "The Admininmizer" },
//   ]
