import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/login.jsx'
import Verify from '../pages/verify.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
