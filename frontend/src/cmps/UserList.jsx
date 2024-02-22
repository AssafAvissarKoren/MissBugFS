import { UserPreview } from './UserPreview'
import { useNavigate } from "react-router"

export function UserList({ users, onRemoveUser, onEditUser }) {
  const navigate = useNavigate()

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li className="user-preview" key={user._id}>
          <UserPreview user={user} />
          <div>
            <button onClick={() => {onRemoveUser(user._id)}}>x</button>
            <button onClick={() => {onEditUser(user)}}>Edit</button>
          </div>
          <button onClick={() => {navigate(`/user/${user._id}`)}}>Details</button>
        </li>
      ))}
    </ul>
  )
}
