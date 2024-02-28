import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/msg/' :
    '//localhost:3030/api/msg/'

export const msgService = {
	query,
	get,
	remove,
	add,
    update,
}

async function query() {
    var { data: msgs } = await axios.get(BASE_URL)
    return msgs
}

async function get(msgId) {
    const url = BASE_URL + msgId   
    var { data: msg } = await axios.get(url)
    return msg
}

async function remove(msgId) {
    const url = BASE_URL + msgId
    var { data: res } = await axios.delete(url)
    return res
}

async function add(msg) {
    console.log('msg.service add:', msg, BASE_URL)
    const url = BASE_URL
    const { data: savedMsg } = await axios.post(url, msg)
    return savedMsg
}

async function update(msg) {
    const url = BASE_URL + msg._id
    const { data: savedMsg } = await axios.put(url, msg)
    return savedMsg
}