import React, { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseChart from './components/ExpenseChart'
import AuthForm from './components/AuthForm'
import { supabase } from './supabaseClient'

const TABLE = 'expenses'

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [session, setSession] = useState(null)
  const [authMode, setAuthMode] = useState('signin')

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      if (currentSession) {
        setMessage('Signed in successfully.')
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user) {
      setExpenses([])
      setLoading(false)
      return
    }

    async function loadExpenses() {
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from(TABLE)
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
        setExpenses([])
      } else {
        setExpenses(data || [])
      }

      setLoading(false)
    }

    loadExpenses()
  }, [session])

  const handleAuthSubmit = async ({ email, password, confirmPassword, mode }) => {
    setError('')
    setMessage('')
    setAuthLoading(true)

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        setAuthLoading(false)
        return
      }

      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) {
        setError(signUpError.message)
      } else {
        setMessage('Account created! Please check your email to confirm your account.')
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        setError(signInError.message)
      }
    }

    setAuthLoading(false)
  }

  const handleSignOut = async () => {
    setError('')
    setMessage('')
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      setError(signOutError.message)
    } else {
      setMessage('Signed out successfully.')
    }
  }

  const addExpense = async (exp, file) => {
    setError('')
    setMessage('')

    if (!session?.user) {
      setError('Please sign in before adding expenses.')
      return
    }

    let invoice_path = null
    let invoice_name = null

    if (file) {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `${session.user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('invoices')
          .upload(filePath, file)

        if (uploadError) {
          setError(`Upload failed: ${uploadError.message}`)
          return
        }

        invoice_path = filePath
        invoice_name = file.name
      } catch (uploadErr) {
        setError(`Upload failed: ${uploadErr.message}`)
        return
      }
    }

    try {
      const { data, error: insertError } = await supabase
        .from(TABLE)
        .insert([{ ...exp, user_id: session.user.id, invoice_path, invoice_name }])
        .select()
        .single()

      if (insertError) {
        if (invoice_path) {
          await supabase.storage.from('invoices').remove([invoice_path])
        }
        setError(insertError.message)
        return
      }

      setExpenses((prev) => [data, ...prev])
      setMessage('Expense saved successfully.')
    } catch (err) {
      if (invoice_path) {
        await supabase.storage.from('invoices').remove([invoice_path])
      }
      setError(err.message || 'Unexpected error')
    }
  }

  const deleteExpense = async (id) => {
    setError('')
    setMessage('')

    const expenseToDelete = expenses.find((e) => e.id === id)

    const { error: deleteError } = await supabase.from(TABLE).delete().eq('id', id).eq('user_id', session?.user?.id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }

    if (expenseToDelete?.invoice_path) {
      await supabase.storage.from('invoices').remove([expenseToDelete.invoice_path])
    }

    setExpenses((prev) => prev.filter((e) => e.id !== id))
    setMessage('Expense deleted successfully.')
  }

  const editExpense = async (id, updates, newFile, clearAttachment) => {
    setError('')
    setMessage('')

    const existingExpense = expenses.find((e) => e.id === id)
    let invoice_path = existingExpense?.invoice_path || null
    let invoice_name = existingExpense?.invoice_name || null
    let fileToDelete = null

    if (clearAttachment) {
      fileToDelete = existingExpense?.invoice_path
      invoice_path = null
      invoice_name = null
    } else if (newFile) {
      try {
        const fileExt = newFile.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `${session.user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('invoices')
          .upload(filePath, newFile)

        if (uploadError) {
          setError(`Upload failed: ${uploadError.message}`)
          return
        }

        fileToDelete = existingExpense?.invoice_path
        invoice_path = filePath
        invoice_name = newFile.name
      } catch (uploadErr) {
        setError(`Upload failed: ${uploadErr.message}`)
        return
      }
    }

    const finalUpdates = {
      ...updates,
      invoice_path,
      invoice_name,
    }

    const { data, error: updateError } = await supabase
      .from(TABLE)
      .update(finalUpdates)
      .eq('id', id)
      .eq('user_id', session?.user?.id)
      .select()
      .single()

    if (updateError) {
      if (newFile && invoice_path) {
        await supabase.storage.from('invoices').remove([invoice_path])
      }
      setError(updateError.message)
      return
    }

    if (fileToDelete) {
      await supabase.storage.from('invoices').remove([fileToDelete])
    }

    setExpenses((prev) => prev.map((expense) => (expense.id === id ? data : expense)))
    setMessage('Expense updated successfully.')
  }

  return (
    <div className="app">
      <div className="app-header">
        {session?.user ? (
          <button className="logout-button" onClick={handleSignOut}>
            Sign out
          </button>
        ) : null}
      </div>
      <h1>Sai Teja's Personal Expenses Tracker</h1>
      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="success">{message}</p> : null}

      {!session?.user ? (
        <div className="auth-card">
          <h2>{authMode === 'signup' ? 'Create your account' : 'Sign in to continue'}</h2>
          <AuthForm
            mode={authMode}
            onSubmit={handleAuthSubmit}
            loading={authLoading}
            switchMode={setAuthMode}
          />
        </div>
      ) : (
        <>
          <ExpenseForm onAdd={addExpense} />
          <ExpenseChart expenses={expenses} />
          {loading ? <p className="loading">Loading expenses...</p> : null}
          <ExpenseList expenses={expenses} onDelete={deleteExpense} onEdit={editExpense} />
        </>
      )}
    </div>
  )
}
