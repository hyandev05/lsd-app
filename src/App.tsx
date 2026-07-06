import { Routes, Route } from 'react-router-dom'
import User from './pages/user'

function App() {
  return (
    <Routes>
      <Route path="*" element={<User />} />
    </Routes>
  )
}

export default App
