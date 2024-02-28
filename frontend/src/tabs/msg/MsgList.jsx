
import { MsgPreview } from './MsgPreview'
import { useNavigate } from "react-router"

export function MsgList({ msgs, onRemoveMsg, onEditMsg }) {
  const navigate = useNavigate()

  return (
    <ul className="bug-list">
      {msgs.map((msg) => (
        <li className="bug-preview" key={msg._id}>
          <MsgPreview msg={msg} />
          <div>
            <button onClick={() => {onRemoveMsg(msg._id)}}>x</button>
            <button onClick={() => {onEditMsg(msg)}}>Edit</button>
          </div>
          <button onClick={() => {navigate(`/msg/${msg._id}`)}}>Details</button>
        </li>
      ))}
    </ul>
  )
}
