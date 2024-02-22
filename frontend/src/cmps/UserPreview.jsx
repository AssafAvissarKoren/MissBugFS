import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export function UserPreview({ user }) {

    return <article >
        <h4>{user.username}</h4>
        <h1><FontAwesomeIcon icon={faUser} /></h1>
        <p>Fullname: <span>{user.fullname}</span></p>
        <p>Score: <span>{user.score}</span></p>
    </article>
}