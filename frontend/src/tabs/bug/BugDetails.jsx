
import { useState } from 'react'
import { bugService } from '../../services/bug.service.js'
import { showErrorMsg } from '../../services/event-bus.service.js'
import { useEffect } from 'react'
import { useNavigate, useParams } from "react-router"

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadBug()
    }, [])

    async function loadBug() {
        try {
            const bug = await bugService.get(bugId)
            setBug(bug)
        } catch (err) {
            showErrorMsg('Cannot load bug')

        }
    }

    if (!bug) return <h1>loadings....</h1>
    return <div className="bug-details main-layout">
        <h3>Bug Details 🐛</h3>
        <h4>{bug.title}</h4>
        <div>Description: <span>{bug.description}</span></div>
        <div>Severity: <span>{bug.severity}</span></div>
        <div>Creator: <span>{bug.creator.fullname}</span></div>
        <button onClick={() => {navigate("/bug")}} style={{width: '100px'}}>Back to List</button>
        </div>
}

