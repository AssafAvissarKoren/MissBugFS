
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './tabs/bug/BugIndex.jsx'
import { BugDetails } from './tabs/bug/BugDetails.jsx'
import { UserIndex } from './tabs/user/UserIndex.jsx'
import { UserDetails } from './tabs/user/UserDetails.jsx'
import { MsgIndex } from './tabs/msg/MsgIndex.jsx'
import { MsgDetails } from './tabs/msg/MsgDetails.jsx'

import { AboutUs } from './pages/AboutUs.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export function App() {
  return (
    <Router>
      <div>
        <AppHeader />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/bug' element={<BugIndex />} />           
            <Route path='/bug/:bugId' element={<BugDetails />} />
            <Route path='/user' element={<UserIndex />} />
            <Route path='/user/:userId' element={<UserDetails />} />
            <Route path='/msg' element={<MsgIndex />} />
            <Route path='/msg/:msgId' element={<MsgDetails />} />
            <Route path='/about' element={<AboutUs />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </Router>
  )
}
