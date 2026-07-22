import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/login.jsx'
import Register from '../pages/register.jsx'
import Verify from '../pages/verify.jsx'
import Activities from '../pages/activities.jsx'
import Babyfoot from '../pages/babyfoot.jsx'
import Billiard from '../pages/billiard.jsx'
import Pingpong from '../pages/pingpong.jsx'
import Join from '../pages/join.jsx'
import Lounge from '../pages/lounge.jsx'
import Reserve from '../pages/reserve.jsx'
import ReserveTable from '../pages/reserve-table.jsx'
import Rooms from '../pages/rooms.jsx'
import PcRoom from '../pages/pcroom.jsx'
import PsRoom from '../pages/psroom.jsx'
import Tournaments from '../pages/tournaments.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/activities" element={<RequireAuth><Activities /></RequireAuth>} />
          <Route path="/babyfoot" element={<RequireAuth><Babyfoot /></RequireAuth>} />
          <Route path="/billiard" element={<RequireAuth><Billiard /></RequireAuth>} />
          <Route path="/pingpong" element={<RequireAuth><Pingpong /></RequireAuth>} />
          <Route path="/join" element={<RequireAuth><Join /></RequireAuth>} />
          <Route path="/lounge" element={<Lounge />} />
          <Route path="/reserve" element={<RequireAuth><Reserve /></RequireAuth>} />
          <Route path="/reserve-table" element={<RequireAuth><ReserveTable /></RequireAuth>} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/pcroom" element={<RequireAuth><PcRoom /></RequireAuth>} />
          <Route path="/psroom" element={<RequireAuth><PsRoom /></RequireAuth>} />
          <Route path="/tournaments" element={<Tournaments />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
