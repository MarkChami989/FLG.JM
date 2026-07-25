import { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'flg_session'
const IDLE_LIMIT_MS = 60 * 60 * 1000 // 1 hour
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']
const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const login = useCallback((u) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const idleTimer = useRef(null)

  useEffect(() => {
    if (!user) return

    function resetIdleTimer() {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(logout, IDLE_LIMIT_MS)
    }

    resetIdleTimer()
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, resetIdleTimer))

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetIdleTimer))
    }
  }, [user, logout])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
