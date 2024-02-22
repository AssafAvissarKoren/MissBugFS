import { userService } from './user.service'
import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/auth/' :
    '//localhost:3030/api/auth/'

export const authService = {
    login,
    logout,
    signup,
}

async function login(credentials) {
    const { data: user } = await axios.post(BASE_URL + 'login', credentials)
    console.log('authService login', user)
    if (user) {
        return userService.saveLocalUser(user)
    }
}

async function signup(credentials) {
    try {
        const { data: user } = await axios.post(BASE_URL + 'signup', credentials)
        console.log('authService signup', user)
        if (user) {
            return userService.saveLocalUser(user)
        }
    } catch (err) {
        const error = (err.response && err.response.data && err.response.data.err) ?  err.response.data.err : err
        console.error('Signup error:', error)
    }
}

async function logout() {
    await axios.post(BASE_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}
