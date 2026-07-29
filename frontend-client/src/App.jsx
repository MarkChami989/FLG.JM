import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth.jsx'
import { ChatProvider } from './chat.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/login.jsx'
import Register from '../pages/register.jsx'
import Verify from '../pages/verify.jsx'
import FaceSetup from '../pages/facesetup.jsx'
import FaceLogin from '../pages/facelogin.jsx'
import ForgotPassword from '../pages/forgot-password.jsx'
import ResetVerify from '../pages/reset-verify.jsx'
import ResetPassword from '../pages/reset-password.jsx'
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
import Messages from '../pages/messages.jsx'
import ChatThread from '../pages/chat-thread.jsx'

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/face-setup" element={<FaceSetup />} />
            <Route path="/face-login" element={<FaceLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-verify" element={<ResetVerify />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
            <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
            <Route path="/messages/:id" element={<RequireAuth><ChatThread /></RequireAuth>} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  )
}

export default App
