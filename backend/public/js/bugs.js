let bugsVisible = false

async function getBugs() {
    const elPre = document.querySelector('pre')

    if (!bugsVisible) {
        const res = await fetch('api/bug')
        const bugs = await res.json()
        elPre.innerText = JSON.stringify(bugs, null, 4)
        bugsVisible = true
    } else {
        elPre.innerText = ''
        bugsVisible = false
    }
}
