import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import {
  useEffect,
  useState
} from 'react'

import { supabase } from './services/supabase'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'

import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {

  const [session, setSession] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    // Get current session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {

        setSession(session)

        setLoading(false)
      })

    // Listen for auth changes
    const {
      data: authListener
    } = supabase.auth.onAuthStateChange(

      (_event, session) => {

        setSession(session)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }

  }, [])

  // Loading state
  if (loading) {

    return (
      <div className="loading-screen">
        Loading...
      </div>
    )
  }

  return (

    <BrowserRouter>

      <Routes>

        {/* Signup */}
        <Route
          path="/signup"
          element={<SignupPage />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Protected Chat */}
        <Route

          path="/chat"

          element={
            <ProtectedRoute session={session}>

              <ChatPage />

            </ProtectedRoute>
          }
        />

        {/* Redirect Logic */}
        <Route

          path="*"

          element={
            session
              ? <Navigate to="/chat" />
              : <Navigate to="/login" />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}