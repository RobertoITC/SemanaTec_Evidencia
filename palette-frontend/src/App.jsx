import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Results from './pages/Results'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/results" element={<Results />}/>
      </Routes>
  )
}

export default App
