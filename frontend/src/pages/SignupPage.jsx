import { useState } from 'react'

import {
  motion
} from 'framer-motion'

import {
  Link
} from 'react-router-dom'

import {
  FiEye,
  FiEyeOff
} from 'react-icons/fi'

import AmbientBackground from '../components/AmbientBackground'

import { supabase } from '../services/supabase'

export default function SignupPage() {

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)

  async function handleSignup() {

    if (!email || !password) {

      alert('Please fill all fields')

      return
    }

    setLoading(true)

    const { error } =
      await supabase.auth.signUp({

        email,
        password
      })

    setLoading(false)

    if (error) {

      alert(error.message)

    } else {

      alert(
        'Signup successful! Check your email.'
      )
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

        <h1>Create Account</h1>

        <p>
          Begin your emotional companion journey.
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

        {/* Signup Button */}

        <motion.button

          whileHover={{
            scale: 1.02
          }}

          whileTap={{
            scale: 0.98
          }}

          onClick={handleSignup}
        >
          {
            loading
              ? 'Creating account...'
              : 'Create Account'
          }
        </motion.button>

        {/* Switch */}

        <div className="auth-switch">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </div>

      </motion.div>

    </div>
  )
}