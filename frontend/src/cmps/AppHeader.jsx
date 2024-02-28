import { NavLink } from "react-router-dom"
import { UserMsg } from "./UserMsg.jsx"
import { useState } from "react"
import { LoginSignup } from "./LoginSignup.jsx"
import { userService } from "../services/user.service.js"
import { authService } from "../services/auth.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { useNavigate } from "react-router"



export function AppHeader() {
    // Will be in the store in the future~~
    const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())
    const navigate = useNavigate()

    async function onLogin(credentials) {
        try {
            const user = await authService.login(credentials)
            setLoggedinUser(user)
            showSuccessMsg(`Welcome ${user.fullname}`)
        } catch (err) {
            console.log('Cannot login :', err)
            showErrorMsg(`Cannot login`)
        }
    }

    async function onSignup(credentials) {
        console.log("AppHeader onSignup", credentials)
        try {
            const user = await authService.signup(credentials)
            setLoggedinUser(user)
            showSuccessMsg(`Welcome ${user.fullname}`)
        } catch (err) {
            console.log('Cannot signup :', err)
            showErrorMsg(`Cannot signup`)
        }
        // add signup
    }

    async function onLogout() {
        console.log('logout')
        try {
            await authService.logout()
            setLoggedinUser(null)
            showSuccessMsg(`Succefssfully logged out!`)
            navigate('/')
        } catch (err) {
            console.log('can not logout')
        }
        // add logout
    }

    function isAllowed() {
        return loggedinUser?.isAdmin
    }

    function loggedProfile() {
        navigate(`/user/${loggedinUser._id}`)
    }


    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Bug App</h1>

                <section className="login-signup-container">
                    {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

                    {loggedinUser && <div className="user-preview">
                        <h3>Hello {loggedinUser.fullname}
                            <button onClick={onLogout}>Logout</button>
                            <button onClick={loggedProfile}>Logged Profile</button>

                        </h3>
                    </div>}
                </section>

                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink> |
                    <NavLink to="/bug">Bugs</NavLink> |
                    {isAllowed() && 
                        <>
                            <NavLink to="/user">Users</NavLink><>|</>
                            <NavLink to="/msg">Messages</NavLink><>|</>
                            <NavLink to="/about">About</NavLink>
                        </>
                    }
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
