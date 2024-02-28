import { useState } from 'react'
import { userService } from '../../services/user.service.js'
import { showErrorMsg } from '../../services/event-bus.service.js'
import { useEffect } from 'react'
import { useNavigate, useParams } from "react-router"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export function UserDetails() {

    const [user, setUser] = useState(null)
    const { userId } = useParams()
    const [userBugs, setUserBugs] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [])

    async function loadUser() {
        try {
            setUser(await userService.get(userId))
            setUserBugs(await userService.getUserBugs(userId))
        } catch (err) {
            showErrorMsg('Cannot load user')

        }
    }

    if (!user) return <h1>loadings....</h1>
    
    return <div className="user-details main-layout">
        <h3>User Details <FontAwesomeIcon icon={faUser} /></h3>
        <h4>{user.title}</h4>
        <div>Username: <span>{user.username}</span></div>
        <div>Full Name: <span>{user.fullname}</span></div>
        <div>Score: <span>{user.score}</span></div>
        <div>Users Bugs: <span>{userBugs.map(bug => bug.title).join(', ')}</span></div>
        <button onClick={() => {navigate("/user")}} style={{width: '100px'}}>Back to List</button>
        </div>
}
