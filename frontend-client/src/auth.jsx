import { createContext, useContext, useCallback, useState } from 'react'
import { connectSocket, disconnectSocket } from './socket.js'

const STORAGE_KEY = 'flg_user'
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
  const [user, setUser] = useState(() => {
    const u = readStoredUser()
    if (u) connectSocket(u)
    return u
  })

  const login = useCallback((u) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUser(u)
    connectSocket(u)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    disconnectSocket()
  }, [])

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
