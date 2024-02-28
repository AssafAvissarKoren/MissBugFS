import { msgService } from '../../services/msg.service.js'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'
import { MsgList } from './MsgList.jsx'
import { useState, useEffect } from 'react'

export function MsgIndex() { 
  const [msgs, setMsgs] = useState([])

  useEffect(() => {
    loadMsgs()
  }, [])

  async function loadMsgs() {
    try {
      const msgs = await msgService.query()
      setMsgs(msgs)
    } catch (err) {
      console.log('err:', err)
    }
  }

  async function onRemoveMsg(msgId) {
    try {
      await msgService.remove(msgId)
      setMsgs(prevMsgs => prevMsgs.filter((msg) => msg._id !== msgId))
      showSuccessMsg('Msg removed')
    } catch (err) {
      console.log('Error from onRemoveMsg ->', err)
      showErrorMsg('Cannot remove msg')
    }
  }

  async function onEditMsg(msg) {
    const severity = prompt('New severity?')
    const msgToSave = { ...msg, severity }
    try {
      const savedMsg = await msgService.update(msgToSave)
      setMsgs(prevMsgs => prevMsgs.map((currMsg) =>
        currMsg._id === savedMsg._id ? savedMsg : currMsg
      ))
      showSuccessMsg('Msg updated')
    } catch (err) {
      console.log('Error from onEditMsg ->', err)
      showErrorMsg('Cannot update msg')
    }
  }

  return (
    <main className="main-layout">
      <h3>Msgs App</h3>
      <main>
        <MsgList msgs={msgs} onRemoveMsg={onRemoveMsg} onEditMsg={onEditMsg}/>
      </main>
    </main>
  )
}
