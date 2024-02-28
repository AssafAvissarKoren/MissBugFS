import { bugService } from '../../services/bug.service.js'
import { userService } from '../../services/user.service.js'
import { msgService } from '../../services/msg.service.js'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'
import { BugList } from './BugList.jsx'
import { BugFilter } from './BugFilter.jsx'
import { PageNumbers } from '../../cmps/PageNumbers.jsx'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import jsPDF from 'jspdf'


export function BugIndex() { 
  const params = useParams()
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter(params))
  const [currentPage, setCurrentPage] = useState(1)
  const [bugsPerPage, setBugsPerPage] = useState(0)
  const [totalNumberOfBugs, setTotalNumberOfBugs] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    loadBugs()
    fetchSettings()
    filterNav(filterBy)
  }, [])

  useEffect(() => {
    loadBugs()
    filterNav(filterBy)
  }, [filterBy])

  function filterNav(filterBy) {
    try {
        const filterURL = bugService.filterURL(filterBy)
        navigate(filterURL, { replace: true })
    } catch (err) {
        console.log('err:', err)
    }
  }

  async function fetchSettings() {
    const settings = await bugService.getSettings()
    setBugsPerPage(settings.bugsPerPage)
    setTotalNumberOfBugs(settings.totalNumberOfBugs)
  }

  async function loadBugs() {
    try {
      const bugs = await bugService.query(filterBy)
      setBugs(bugs)
    } catch (err) {
      console.log('err:', err)
    }
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      severity: +prompt('Bug severity?'),
    }
    try {
      const savedBug = await bugService.add(bug)
      setBugs(prevBugs => [...prevBugs, savedBug])
      showSuccessMsg('Bug added')
    } catch (err) {
      console.log('Error from onAddBug ->', err)
      showErrorMsg('Cannot add bug')
    }
  }

  async function onEditBug(bug) {
    const severity = prompt('New severity?')
    const bugToSave = { ...bug, severity }
    try {
      const savedBug = await bugService.update(bugToSave)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      showSuccessMsg('Bug updated')
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  async function onAddMsg(bugId) {
    const msg = prompt('New Message')
    const loggedinUser = userService.getLoggedinUser()
    if (loggedinUser) {
      const msgToAdd = {
        txt: msg,
        aboutBugId: bugId,
        byUserId: loggedinUser._id
      }
      try {
        await msgService.add(msgToAdd)
        showSuccessMsg('Message added')
      } catch (err) {
        console.log('Error from onAddMsg ->', err)
        showErrorMsg('Cannot add message')
      }
    }
  }


  function downloadBugsAsPDF() {
    const doc = new jsPDF()
    doc.text("Bug List", 10, 10)
    let yPos = 20
    const textHeight = 12
    doc.setFontSize(textHeight)
    bugs.forEach((bug, index) => {
      const createdAtDate = new Date(bug.createdAt)
      const formattedDate = createdAtDate.toLocaleDateString()
      const text = `${index + 1}. Title: ${bug.title}\n    Severity: ${bug.severity}\n    Created At: ${formattedDate}`
      const splitText = doc.splitTextToSize(text, 180)

      console.log("text: ", index + 1, " | splitText: ", splitText, " | textHeight: ", textHeight)
      
      if (yPos + textHeight > doc.internal.pageSize.height - 20) {
        doc.addPage()
        yPos = 20
      }
      doc.text(splitText, 10, yPos)
      yPos += textHeight / 2 + 10

    })
    doc.save("bug_list.pdf")
  }
    
  return (
    <main className="main-layout">
      <h3>Bugs App</h3>
      <main>
        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <button onClick={downloadBugsAsPDF}>Download Bugs as PDF</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} onAddMsg={onAddMsg}/>
        <PageNumbers
          totalNum={totalNumberOfBugs} 
          numPerPage={bugsPerPage} 
          filterBy={filterBy} 
          onSetFilterBy={onSetFilterBy} 
          setCurrentPage={setCurrentPage} 
        />
      </main>
    </main>
  )
}
