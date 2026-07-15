import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Tournaments from '../pages/tournaments.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/babyfoot" element={<Babyfoot />} />
        <Route path="/billiard" element={<Billiard />} />
        <Route path="/pingpong" element={<Pingpong />} />
        <Route path="/join" element={<Join />} />
        <Route path="/lounge" element={<Lounge />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/reserve-table" element={<ReserveTable />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/tournaments" element={<Tournaments />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
