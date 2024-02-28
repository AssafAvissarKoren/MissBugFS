
import { useState } from 'react'
import { msgService } from '../../services/msg.service.js'
import { showErrorMsg } from '../../services/event-bus.service.js'
import { useEffect } from 'react'
import { useNavigate, useParams } from "react-router"

export function MsgDetails() {

    const [msg, setMsg] = useState(null)
    const { msgId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadMsg()
    }, [])

    async function loadMsg() {
        try {
            const msg = await msgService.get(msgId)
            setMsg(msg)
        } catch (err) {
            showErrorMsg('Cannot load msg')

        }
    }

    if (!msg) return <h1>loadings....</h1>
    return <div className="msg-details main-layout">
        <h3>Msg Details 🐛</h3>
        <h4>{msg.txt}</h4>
        <p>Bug Title: <span>{msg.aboutBug.title}</span></p>
        <p>Bug Severity: <span>{msg.aboutBug.severity}</span></p>
        <p>User Full Name: <span>{msg.byUser.fullname}</span></p>
        <button onClick={() => {navigate("/msg")}} style={{width: '100px'}}>Back to List</button>
        </div>
}

