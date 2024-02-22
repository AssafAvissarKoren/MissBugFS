let usersVisible = false

async function getUsers() {
    const elPre = document.querySelector('pre')

    if (!usersVisible) {
        const res = await fetch('api/user')
        const users = await res.json()
        elPre.innerText = JSON.stringify(users, null, 4)
        usersVisible = true
    } else {
        elPre.innerText = ''
        usersVisible = false
    }
}