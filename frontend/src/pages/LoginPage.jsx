import { useState } from 'react'

import {
  motion
} from 'framer-motion'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  FiEye,
  FiEyeOff
} from 'react-icons/fi'

import AmbientBackground from '../components/AmbientBackground'

import { supabase } from '../services/supabase'

export default function LoginPage() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)

  async function handleLogin() {

    if (!email || !password) {

      alert('Please fill all fields')

      return
    }

    setLoading(true)

    const { error } =
      await supabase.auth.signInWithPassword({

        email,
        password
      })

    setLoading(false)

    if (error) {

      alert(error.message)

    } else {

      navigate('/chat')
    }
  }

  return (

    <div className="auth-page">

      <AmbientBackground />

      <motion.div

        className="auth-card"

        initial={{
          opacity: 0,
          y: 20,
          scale: 0.96
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }}

        transition={{
          duration: 0.5
        }}
      >

        <h1>Welcome Back</h1>

        <p>
          Continue your emotional journey safely.
        </p>

        {/* Email */}

        <input
          type="email"

          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* Password */}

        <div className="password-wrapper">

          <input

            type={
              showPassword
                ? 'text'
                : 'password'
            }

            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button

            className="eye-button"

            onClick={() =>
              setShowPassword(!showPassword)
            }
          >

            {
              showPassword

                ? <FiEyeOff />

                : <FiEye />
            }

          </button>

        </div>

        {/* Login Button */}

        <motion.button

          whileHover={{
            scale: 1.02
          }}

          whileTap={{
            scale: 0.98
          }}

          onClick={handleLogin}
        >
          {
            loading
              ? 'Please wait...'
              : 'Login'
          }
        </motion.button>

        {/* Switch */}

        <div className="auth-switch">

          Don't have an account?

          <Link to="/signup">
            Create Account
          </Link>

        </div>

      </motion.div>

    </div>
  )
}