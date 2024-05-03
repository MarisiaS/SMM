import './App.css'
import Login from './components/Login'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/NavBar" element={<NavBar />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
