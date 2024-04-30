import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import NavBar from './components/NavBar'
import AthletesList from './components/AthleteLists'
import {Routes, Route, useLocation} from 'react-router-dom'
import ProtectedRoute from './components/ProtectecRoutes'
import SwimMeet from './components/SwimMeet/SwimMeet'


function App() {
  const location = useLocation()
  const noNavBar = location.pathname === "/"

  return (
    <>
      {
        noNavBar ? 
        <Routes>
          <Route path="/" element={<Login />}/>
        </Routes>
        :
        <NavBar 
          content = {
            <Routes>
              <Route element={<ProtectedRoute/>}>
                <Route path="/home" element={<Home />}/>
                <Route path="/athlete" element={<AthletesList />}/>
              </Route>
              <Route path="/SwimMeet" element={<SwimMeet />}/>

            </Routes> 
          }
        />
      }
    </>
  )
}

export default App
