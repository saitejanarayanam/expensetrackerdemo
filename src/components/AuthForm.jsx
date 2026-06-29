import React, { useState } from 'react'

export default function AuthForm({ mode, onSubmit, loading, switchMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ email, password, confirmPassword, mode })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email address"
        type="email"
        autoComplete="email"
        required
      />
      <input
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        type="password"
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        required
      />
      {mode === 'signup' ? (
        <input
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm password"
          type="password"
          autoComplete="new-password"
          required
        />
      ) : null}
      <button type="submit" disabled={loading}>
        {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
      </button>
      <p className="auth-toggle">
        {mode === 'signup' ? 'Already have an account?' : "Need an account?"}
        <button type="button" className="link-button" onClick={() => switchMode(mode === 'signup' ? 'signin' : 'signup')}>
          {mode === 'signup' ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </form>
  )
}
