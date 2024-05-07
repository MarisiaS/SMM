import './App.css'
import Login from './components/Login'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar'
import SwimMeetDisplay from './components/SwimMeet/SwimMeetDisplay'
import AddNewSwimMeet from './components/SwimMeet/AddNewSwimMeet'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/NavBar" element={<NavBar />}/>
          <Route path="/SwimMeet" element={<SwimMeetDisplay />}/>
          <Route path="/AddNewSwimMeet" element={<AddNewSwimMeet />}/>

        </Routes>
      </Router>
    </>
  )
}

export default App
