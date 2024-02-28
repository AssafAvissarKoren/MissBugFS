export function MsgPreview({ msg }) {

    return <article >
        <h4>{msg.txt}</h4>
        <h1>🐛</h1>
        <p>Bug Title: <span>{msg.aboutBug.title}</span></p>
        <p>User Name: <span>{msg.byUser.fullname}</span></p>
    </article>
}