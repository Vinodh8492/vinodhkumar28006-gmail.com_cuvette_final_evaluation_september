import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DashBoardPage from '../Pages/DashBoardPage/DashBoardPage'
import RegisterPage from '../Pages/RegsiterPage/RegisterPage'
import LoginPage from '../Pages/LoginPage/LoginPage'
import AnalyticsPage from '../Pages/AnalyticsPage/AnalyticsPage'
import SettingsPage from '../Pages/SettingsPage/SettingsPage'
import ShareTaskPage from '../Pages/ShareTaskPage/ShareTaskPage'
import Private_Route from '../Components/Middleware/Private_Route'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Private_Route element={<DashBoardPage />} />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/analytics' element={<Private_Route element={<AnalyticsPage />} />} />
        <Route path='/settings' element={<Private_Route element={<SettingsPage />} />} />
        <Route path='/share/:taskId' element={<ShareTaskPage />} />
      </Routes>
    </>
  )
}

export default App