
import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'
import { useNavigate } from "react-router"

export function BugList({ bugs, onRemoveBug, onEditBug }) {
  const navigate = useNavigate()

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            <button onClick={() => {onRemoveBug(bug._id)}}>x</button>
            <button onClick={() => {onEditBug(bug)}}>Edit</button>
          </div>
          <button onClick={() => {navigate(`/bug/${bug._id}`)}}>Details</button>
        </li>
      ))}
    </ul>
  )
}
