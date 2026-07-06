import { Routes, Route, Navigate } from 'react-router-dom'
import User from './pages/user'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz" replace />} />
      <Route path="/quiz" element={<User />} />
      <Route path="/admin2" element={<User />} />
    </Routes>
  )
}

export default App
